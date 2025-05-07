import { AnchorProvider, BN, Program, Wallet, web3 } from "@coral-xyz/anchor";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { Buffer } from "buffer";
import { Reflink } from "./reflink-types";
import IDL from "./reflink.json";

export class ReflinkSDK {
  private program: Program<Reflink>;
  private connection: Connection;
  private wallet: Wallet;
  private provider: AnchorProvider;

  constructor(
    connection: Connection,
    wallet: Wallet, // Wallet adapter that implements .signTransaction and .publicKey
    programId?: string // Optional program ID
  ) {
    this.connection = connection;
    this.wallet = wallet;

    // Create a provider that will be used to interact with the Solana network
    this.provider = new AnchorProvider(
      connection,
      wallet,
      AnchorProvider.defaultOptions()
    );

    // Update the IDL address if programId is provided
    if (programId) {
      IDL.address = programId;
    }

    // Create the program interface which will be used to invoke the program's instructions
    this.program = new Program(IDL, this.provider);
  }

  /**
   * Get the program instance
   * @returns The Anchor program instance
   */
  getProgram(): Program<Reflink> {
    return this.program;
  }

  /**
   * Derive a PDA for an affiliate account
   * @param authority The authority address (usually the affiliate's wallet)
   * @returns [affiliate PDA, bump]
   */
  async findAffiliatePDA(authority: PublicKey): Promise<[PublicKey, number]> {
    return await PublicKey.findProgramAddress(
      [Buffer.from("affiliate"), authority.toBuffer()],
      this.program.programId
    );
  }

  /**
   * Derive a PDA for a merchant account
   * @param authority The authority address (usually the merchant's wallet)
   * @returns [merchant PDA, bump]
   */
  async findMerchantPDA(authority: PublicKey): Promise<[PublicKey, number]> {
    return await PublicKey.findProgramAddress(
      [Buffer.from("merchant"), authority.toBuffer()],
      this.program.programId
    );
  }

  /**
   * Register a new affiliate
   * @returns Transaction signature
   */
  async registerAffiliate(): Promise<string> {
    // Create a keypair for the affiliate account
    const affiliateKeypair = web3.Keypair.generate();

    try {
      // Execute the transaction to register an affiliate
      const tx = await this.program.methods
        .registerAffiliate()
        .accounts({
          affiliate: affiliateKeypair.publicKey,
          authority: this.wallet.publicKey,
        })
        .signers([affiliateKeypair])
        .rpc();

      console.log("Affiliate registered with tx:", tx);
      console.log("Affiliate account:", affiliateKeypair.publicKey.toString());

      return tx;
    } catch (error) {
      console.error("Error registering affiliate:", error);
      throw error;
    }
  }

  /**
   * Register a new merchant
   * @param commissionBps The commission rate in basis points (100 = 1%)
   * @returns Transaction signature
   */
  async registerMerchant(commissionBps: number): Promise<string> {
    // Validate commission rate
    if (commissionBps > 10000) {
      throw new Error(
        "Commission rate cannot exceed 100% (10000 basis points)"
      );
    }

    // Create a keypair for the merchant account
    const merchantKeypair = web3.Keypair.generate();

    try {
      // Execute the transaction to register a merchant
      const tx = await this.program.methods
        .registerMerchant(commissionBps)
        .accounts({
          merchant: merchantKeypair.publicKey,
          authority: this.wallet.publicKey,
        })
        .signers([merchantKeypair])
        .rpc();

      console.log("Merchant registered with tx:", tx);
      console.log("Merchant account:", merchantKeypair.publicKey.toString());

      return tx;
    } catch (error) {
      console.error("Error registering merchant:", error);
      throw error;
    }
  }

  /**
   * Process a referral payment in SOL
   * @param merchantPubkey The merchant's account public key
   * @param affiliatePubkey The affiliate's account public key
   * @param merchantWallet The wallet to receive the merchant's portion
   * @param affiliateWallet The wallet to receive the affiliate's commission
   * @param amount The amount of SOL to send (in lamports)
   * @returns Transaction signature
   */
  async processReferralSol(
    merchantPubkey: PublicKey,
    affiliatePubkey: PublicKey,
    merchantWallet: PublicKey,
    affiliateWallet: PublicKey,
    amount: number | BN
  ): Promise<string> {
    // Convert number to BN if needed
    const paymentAmount = typeof amount === "number" ? new BN(amount) : amount;

    // Create a keypair for the referral account
    const referralKeypair = web3.Keypair.generate();

    try {
      // Execute the transaction
      const tx = await this.program.methods
        .registerReferralSol(paymentAmount)
        .accounts({
          affiliate: affiliatePubkey,
          referral: referralKeypair.publicKey,
          merchant: merchantPubkey,
          merchantWallet: merchantWallet,
          affiliateWallet: affiliateWallet,
          payer: this.wallet.publicKey,
        })
        .signers([referralKeypair])
        .rpc();

      console.log("SOL referral processed with tx:", tx);
      console.log("Referral account:", referralKeypair.publicKey.toString());

      return tx;
    } catch (error) {
      console.error("Error processing SOL referral:", error);
      throw error;
    }
  }

  /**
   * Process a referral payment in SPL tokens
   * @param merchantPubkey The merchant's account public key
   * @param affiliatePubkey The affiliate's account public key
   * @param merchantTokenAccount The merchant's token account
   * @param affiliateTokenAccount The affiliate's token account
   * @param tokenMint The mint address of the token
   * @param amount The amount of tokens to send
   * @returns Transaction signature
   */
  async processReferralToken(
    merchantPubkey: PublicKey,
    affiliatePubkey: PublicKey,
    merchantTokenAccount: PublicKey,
    affiliateTokenAccount: PublicKey,
    tokenMint: PublicKey,
    amount: number | BN
  ): Promise<string> {
    // Convert number to BN if needed
    const paymentAmount = typeof amount === "number" ? new BN(amount) : amount;

    // Create a keypair for the referral account
    const referralKeypair = web3.Keypair.generate();

    // Get the payer's token account for this mint
    const payerTokenAccount = await getAssociatedTokenAddress(
      tokenMint,
      this.wallet.publicKey
    );

    try {
      // Execute the transaction
      const tx = await this.program.methods
        .registerReferralToken(paymentAmount)
        .accounts({
          affiliate: affiliatePubkey,
          referral: referralKeypair.publicKey,
          merchant: merchantPubkey,
          tokenMint: tokenMint,
          merchantTokenAccount: merchantTokenAccount,
          affiliateTokenAccount: affiliateTokenAccount,
          payerTokenAccount: payerTokenAccount,
          payer: this.wallet.publicKey,
        })
        .signers([referralKeypair])
        .rpc();

      console.log("Token referral processed with tx:", tx);
      console.log("Referral account:", referralKeypair.publicKey.toString());

      return tx;
    } catch (error) {
      console.error("Error processing token referral:", error);
      throw error;
    }
  }

  /**
   * Update a merchant's commission rate
   * @param merchantPubkey The merchant's account public key
   * @param newCommissionBps The new commission rate in basis points
   * @returns Transaction signature
   */
  async updateMerchantCommission(
    merchantPubkey: PublicKey,
    newCommissionBps: number
  ): Promise<string> {
    // Validate commission rate
    if (newCommissionBps > 10000) {
      throw new Error(
        "Commission rate cannot exceed 100% (10000 basis points)"
      );
    }

    try {
      // Execute the transaction
      const tx = await this.program.methods
        .updateMerchantCommission(newCommissionBps)
        .accounts({
          merchant: merchantPubkey,
          authority: this.wallet.publicKey,
        })
        .rpc();

      console.log("Merchant commission updated with tx:", tx);
      return tx;
    } catch (error) {
      console.error("Error updating merchant commission:", error);
      throw error;
    }
  }

  /**
   * Toggle a merchant's active status
   * @param merchantPubkey The merchant's account public key
   * @returns Transaction signature
   */
  async toggleMerchantStatus(merchantPubkey: PublicKey): Promise<string> {
    try {
      // Execute the transaction
      const tx = await this.program.methods
        .toggleMerchantStatus()
        .accounts({
          merchant: merchantPubkey,
          authority: this.wallet.publicKey,
        })
        .rpc();

      console.log("Merchant status toggled with tx:", tx);
      return tx;
    } catch (error) {
      console.error("Error toggling merchant status:", error);
      throw error;
    }
  }

  /**
   * Get an affiliate's account data
   * @param affiliatePubkey The affiliate's account public key
   * @returns Affiliate account data
   */
  async getAffiliateData(affiliatePubkey: PublicKey): Promise<any> {
    try {
      return await this.program.account.affiliate.fetch(affiliatePubkey);
    } catch (error) {
      console.error("Error fetching affiliate data:", error);
      throw error;
    }
  }

  /**
   * Get a merchant's account data
   * @param merchantPubkey The merchant's account public key
   * @returns Merchant account data
   */
  async getMerchantData(merchantPubkey: PublicKey): Promise<any> {
    try {
      return await this.program.account.merchant.fetch(merchantPubkey);
    } catch (error) {
      console.error("Error fetching merchant data:", error);
      throw error;
    }
  }

  /**
   * Get a referral's account data
   * @param referralPubkey The referral's account public key
   * @returns Referral account data
   */
  async getReferralData(referralPubkey: PublicKey): Promise<any> {
    try {
      return await this.program.account.referral.fetch(referralPubkey);
    } catch (error) {
      console.error("Error fetching referral data:", error);
      throw error;
    }
  }

  /**
   * Get all referrals for a specific affiliate
   * @param affiliatePubkey The affiliate's account public key
   * @returns Array of referral accounts
   */
  async getAffiliateReferrals(affiliatePubkey: PublicKey): Promise<any[]> {
    try {
      const referrals = await this.program.account.referral.all([
        {
          memcmp: {
            offset: 8, // Account discriminator is 8 bytes
            bytes: affiliatePubkey.toBase58(),
          },
        },
      ]);
      return referrals;
    } catch (error) {
      console.error("Error getting affiliate referrals:", error);
      throw error;
    }
  }

  /**
   * Get all referrals for a specific merchant
   * @param merchantPubkey The merchant's account public key
   * @returns Array of referral accounts
   */
  async getMerchantReferrals(merchantPubkey: PublicKey): Promise<any[]> {
    try {
      const referrals = await this.program.account.referral.all([
        {
          memcmp: {
            offset: 8 + 32, // Account discriminator + affiliate pubkey
            bytes: merchantPubkey.toBase58(),
          },
        },
      ]);
      return referrals;
    } catch (error) {
      console.error("Error getting merchant referrals:", error);
      throw error;
    }
  }

  /**
   * Utility function to convert SOL to lamports
   * @param sol Amount in SOL
   * @returns Amount in lamports
   */
  solToLamports(sol: number): BN {
    return new BN(sol * LAMPORTS_PER_SOL);
  }

  /**
   * Utility function to convert lamports to SOL
   * @param lamports Amount in lamports
   * @returns Amount in SOL
   */
  lamportsToSol(lamports: BN | number): number {
    const lamportsNumber =
      lamports instanceof BN ? lamports.toNumber() : lamports;
    return lamportsNumber / LAMPORTS_PER_SOL;
  }
}

// Export types and SDK
export default ReflinkSDK;
