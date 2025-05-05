import { Wallet } from "@coral-xyz/anchor";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import ReflinkSDK from "./reflink-sdk";

// Example React hook for using the Reflink SDK
export function useReflinkSDK() {
  const wallet = useWallet();
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  // Example: Create an SDK instance
  const getSDK = () => {
    if (!wallet) {
      throw new WalletNotConnectedError();
    }

    return new ReflinkSDK(connection, wallet as unknown as Wallet);
  };

  // Example: Register as an affiliate
  const registerAsAffiliate = async () => {
    try {
      const sdk = getSDK();
      const txSignature = await sdk.registerAffiliate();
      console.log("Successfully registered as affiliate:", txSignature);
      return txSignature;
    } catch (error) {
      console.error("Failed to register as affiliate:", error);
      throw error;
    }
  };

  // Example: Register as a merchant with 5% commission
  const registerAsMerchant = async () => {
    try {
      const sdk = getSDK();
      const txSignature = await sdk.registerMerchant(500); // 5%
      console.log("Successfully registered as merchant:", txSignature);
      return txSignature;
    } catch (error) {
      console.error("Failed to register as merchant:", error);
      throw error;
    }
  };

  // Example: Process a SOL referral payment
  const processSolReferral = async (
    merchantPubkey: string,
    affiliatePubkey: string,
    merchantWallet: string,
    affiliateWallet: string,
    amountSol: number
  ) => {
    try {
      const sdk = getSDK();
      const amount = sdk.solToLamports(amountSol);

      const txSignature = await sdk.processReferralSol(
        new PublicKey(merchantPubkey),
        new PublicKey(affiliatePubkey),
        new PublicKey(merchantWallet),
        new PublicKey(affiliateWallet),
        amount
      );

      console.log("Successfully processed SOL referral:", txSignature);
      return txSignature;
    } catch (error) {
      console.error("Failed to process SOL referral:", error);
      throw error;
    }
  };

  // Example: Process a token referral payment
  const processTokenReferral = async (
    merchantPubkey: string,
    affiliatePubkey: string,
    merchantTokenAccount: string,
    affiliateTokenAccount: string,
    tokenMint: string,
    amount: number
  ) => {
    try {
      const sdk = getSDK();

      const txSignature = await sdk.processReferralToken(
        new PublicKey(merchantPubkey),
        new PublicKey(affiliatePubkey),
        new PublicKey(merchantTokenAccount),
        new PublicKey(affiliateTokenAccount),
        new PublicKey(tokenMint),
        amount
      );

      console.log("Successfully processed token referral:", txSignature);
      return txSignature;
    } catch (error) {
      console.error("Failed to process token referral:", error);
      throw error;
    }
  };

  // Example: Update merchant commission
  const updateCommission = async (
    merchantPubkey: string,
    newCommissionBps: number
  ) => {
    try {
      const sdk = getSDK();

      const txSignature = await sdk.updateMerchantCommission(
        new PublicKey(merchantPubkey),
        newCommissionBps
      );

      console.log("Successfully updated commission:", txSignature);
      return txSignature;
    } catch (error) {
      console.error("Failed to update commission:", error);
      throw error;
    }
  };

  // Example: Toggle merchant status
  const toggleMerchantStatus = async (merchantPubkey: string) => {
    try {
      const sdk = getSDK();

      const txSignature = await sdk.toggleMerchantStatus(
        new PublicKey(merchantPubkey)
      );

      console.log("Successfully toggled merchant status:", txSignature);
      return txSignature;
    } catch (error) {
      console.error("Failed to toggle merchant status:", error);
      throw error;
    }
  };

  // Example: Fetch affiliate data
  const getAffiliateData = async (affiliatePubkey: string) => {
    try {
      const sdk = getSDK();
      const data = await sdk.getAffiliateData(new PublicKey(affiliatePubkey));
      console.log("Affiliate data:", data);
      return data;
    } catch (error) {
      console.error("Failed to fetch affiliate data:", error);
      throw error;
    }
  };

  // Example: Get all referrals for an affiliate
  const getAffiliateReferrals = async (affiliatePubkey: string) => {
    try {
      const sdk = getSDK();
      const referrals = await sdk.getAffiliateReferrals(
        new PublicKey(affiliatePubkey)
      );
      console.log("Affiliate referrals:", referrals);
      return referrals;
    } catch (error) {
      console.error("Failed to fetch affiliate referrals:", error);
      throw error;
    }
  };

  return {
    registerAsAffiliate,
    registerAsMerchant,
    processSolReferral,
    processTokenReferral,
    updateCommission,
    toggleMerchantStatus,
    getAffiliateData,
    getAffiliateReferrals,
  };
}
