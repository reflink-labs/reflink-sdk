import { useEffect, useState } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";
import ReflinkSDK from "./reflink-sdk"; // Adjust path as needed

// Define types for the hook state
interface ReflinkState {
  loading: boolean;
  error: Error | null;
  sdk: ReflinkSDK | null;
}

// Define types for various operation results
interface OperationResult {
  loading: boolean;
  error: Error | null;
  txSignature: string | null;
}

interface AccountData {
  loading: boolean;
  error: Error | null;
  data: any | null;
}

/**
 * React hook for using ReflinkSDK within React components
 *
 * @param connection - Solana connection object
 * @param wallet - Wallet adapter that implements signTransaction and publicKey
 * @param programId - Optional custom program ID
 * @returns An object containing the SDK instance and helper methods
 */
export function useReflinkSDK(
  connection: Connection,
  wallet: any, // Should match the Wallet type expected by ReflinkSDK
  programId?: string
) {
  // State for SDK initialization
  const [state, setState] = useState<ReflinkState>({
    loading: true,
    error: null,
    sdk: null,
  });

  // Initialize SDK when dependencies change
  useEffect(() => {
    // Only initialize if we have both connection and wallet
    if (!connection || !wallet || !wallet.publicKey) {
      setState({
        loading: false,
        error: new Error("Missing connection or wallet"),
        sdk: null,
      });
      return;
    }

    try {
      const sdk = new ReflinkSDK(connection, wallet, programId);
      setState({
        loading: false,
        error: null,
        sdk,
      });
    } catch (error) {
      setState({
        loading: false,
        error:
          error instanceof Error
            ? error
            : new Error("Unknown error initializing SDK"),
        sdk: null,
      });
    }
  }, [connection, wallet, programId]);

  // Register affiliate function
  const registerAffiliate = async () => {
    const result: OperationResult = {
      loading: true,
      error: null,
      txSignature: null,
    };

    if (!state.sdk) {
      return {
        ...result,
        loading: false,
        error: new Error("SDK not initialized"),
      };
    }

    try {
      const txSignature = await state.sdk.registerAffiliate();
      return {
        loading: false,
        error: null,
        txSignature,
      };
    } catch (error) {
      return {
        loading: false,
        error:
          error instanceof Error
            ? error
            : new Error("Error registering affiliate"),
        txSignature: null,
      };
    }
  };

  // Register merchant function
  const registerMerchant = async (commissionBps: number) => {
    const result: OperationResult = {
      loading: true,
      error: null,
      txSignature: null,
    };

    if (!state.sdk) {
      return {
        ...result,
        loading: false,
        error: new Error("SDK not initialized"),
      };
    }

    try {
      const txSignature = await state.sdk.registerMerchant(commissionBps);
      return {
        loading: false,
        error: null,
        txSignature,
      };
    } catch (error) {
      return {
        loading: false,
        error:
          error instanceof Error
            ? error
            : new Error("Error registering merchant"),
        txSignature: null,
      };
    }
  };

  // Process SOL referral function
  const processReferralSol = async (
    merchantPubkey: PublicKey,
    affiliatePubkey: PublicKey,
    merchantWallet: PublicKey,
    affiliateWallet: PublicKey,
    amount: number | BN
  ) => {
    const result: OperationResult = {
      loading: true,
      error: null,
      txSignature: null,
    };

    if (!state.sdk) {
      return {
        ...result,
        loading: false,
        error: new Error("SDK not initialized"),
      };
    }

    try {
      const txSignature = await state.sdk.processReferralSol(
        merchantPubkey,
        affiliatePubkey,
        merchantWallet,
        affiliateWallet,
        amount
      );
      return {
        loading: false,
        error: null,
        txSignature,
      };
    } catch (error) {
      return {
        loading: false,
        error:
          error instanceof Error
            ? error
            : new Error("Error processing SOL referral"),
        txSignature: null,
      };
    }
  };

  // Process token referral function
  const processReferralToken = async (
    merchantPubkey: PublicKey,
    affiliatePubkey: PublicKey,
    merchantTokenAccount: PublicKey,
    affiliateTokenAccount: PublicKey,
    tokenMint: PublicKey,
    amount: number | BN
  ) => {
    const result: OperationResult = {
      loading: true,
      error: null,
      txSignature: null,
    };

    if (!state.sdk) {
      return {
        ...result,
        loading: false,
        error: new Error("SDK not initialized"),
      };
    }

    try {
      const txSignature = await state.sdk.processReferralToken(
        merchantPubkey,
        affiliatePubkey,
        merchantTokenAccount,
        affiliateTokenAccount,
        tokenMint,
        amount
      );
      return {
        loading: false,
        error: null,
        txSignature,
      };
    } catch (error) {
      return {
        loading: false,
        error:
          error instanceof Error
            ? error
            : new Error("Error processing token referral"),
        txSignature: null,
      };
    }
  };

  // Update merchant commission function
  const updateMerchantCommission = async (
    merchantPubkey: PublicKey,
    newCommissionBps: number
  ) => {
    const result: OperationResult = {
      loading: true,
      error: null,
      txSignature: null,
    };

    if (!state.sdk) {
      return {
        ...result,
        loading: false,
        error: new Error("SDK not initialized"),
      };
    }

    try {
      const txSignature = await state.sdk.updateMerchantCommission(
        merchantPubkey,
        newCommissionBps
      );
      return {
        loading: false,
        error: null,
        txSignature,
      };
    } catch (error) {
      return {
        loading: false,
        error:
          error instanceof Error
            ? error
            : new Error("Error updating merchant commission"),
        txSignature: null,
      };
    }
  };

  // Toggle merchant status function
  const toggleMerchantStatus = async (merchantPubkey: PublicKey) => {
    const result: OperationResult = {
      loading: true,
      error: null,
      txSignature: null,
    };

    if (!state.sdk) {
      return {
        ...result,
        loading: false,
        error: new Error("SDK not initialized"),
      };
    }

    try {
      const txSignature = await state.sdk.toggleMerchantStatus(merchantPubkey);
      return {
        loading: false,
        error: null,
        txSignature,
      };
    } catch (error) {
      return {
        loading: false,
        error:
          error instanceof Error
            ? error
            : new Error("Error toggling merchant status"),
        txSignature: null,
      };
    }
  };

  // Get affiliate data function
  const getAffiliateData = async (affiliatePubkey: PublicKey) => {
    const result: AccountData = {
      loading: true,
      error: null,
      data: null,
    };

    if (!state.sdk) {
      return {
        ...result,
        loading: false,
        error: new Error("SDK not initialized"),
      };
    }

    try {
      const data = await state.sdk.getAffiliateData(affiliatePubkey);
      return {
        loading: false,
        error: null,
        data,
      };
    } catch (error) {
      return {
        loading: false,
        error:
          error instanceof Error
            ? error
            : new Error("Error fetching affiliate data"),
        data: null,
      };
    }
  };

  // Get merchant data function
  const getMerchantData = async (merchantPubkey: PublicKey) => {
    const result: AccountData = {
      loading: true,
      error: null,
      data: null,
    };

    if (!state.sdk) {
      return {
        ...result,
        loading: false,
        error: new Error("SDK not initialized"),
      };
    }

    try {
      const data = await state.sdk.getMerchantData(merchantPubkey);
      return {
        loading: false,
        error: null,
        data,
      };
    } catch (error) {
      return {
        loading: false,
        error:
          error instanceof Error
            ? error
            : new Error("Error fetching merchant data"),
        data: null,
      };
    }
  };

  // Get referral data function
  const getReferralData = async (referralPubkey: PublicKey) => {
    const result: AccountData = {
      loading: true,
      error: null,
      data: null,
    };

    if (!state.sdk) {
      return {
        ...result,
        loading: false,
        error: new Error("SDK not initialized"),
      };
    }

    try {
      const data = await state.sdk.getReferralData(referralPubkey);
      return {
        loading: false,
        error: null,
        data,
      };
    } catch (error) {
      return {
        loading: false,
        error:
          error instanceof Error
            ? error
            : new Error("Error fetching referral data"),
        data: null,
      };
    }
  };

  // Get affiliate referrals function
  const getAffiliateReferrals = async (affiliatePubkey: PublicKey) => {
    const result: AccountData = {
      loading: true,
      error: null,
      data: null,
    };

    if (!state.sdk) {
      return {
        ...result,
        loading: false,
        error: new Error("SDK not initialized"),
      };
    }

    try {
      const data = await state.sdk.getAffiliateReferrals(affiliatePubkey);
      return {
        loading: false,
        error: null,
        data,
      };
    } catch (error) {
      return {
        loading: false,
        error:
          error instanceof Error
            ? error
            : new Error("Error fetching affiliate referrals"),
        data: null,
      };
    }
  };

  // Get merchant referrals function
  const getMerchantReferrals = async (merchantPubkey: PublicKey) => {
    const result: AccountData = {
      loading: true,
      error: null,
      data: null,
    };

    if (!state.sdk) {
      return {
        ...result,
        loading: false,
        error: new Error("SDK not initialized"),
      };
    }

    try {
      const data = await state.sdk.getMerchantReferrals(merchantPubkey);
      return {
        loading: false,
        error: null,
        data,
      };
    } catch (error) {
      return {
        loading: false,
        error:
          error instanceof Error
            ? error
            : new Error("Error fetching merchant referrals"),
        data: null,
      };
    }
  };

  // Find affiliate PDA
  const findAffiliatePDA = async (authority: PublicKey) => {
    if (!state.sdk) {
      return {
        loading: false,
        error: new Error("SDK not initialized"),
        data: null,
      };
    }

    try {
      const data = await state.sdk.findAffiliatePDA(authority);
      return {
        loading: false,
        error: null,
        data,
      };
    } catch (error) {
      return {
        loading: false,
        error:
          error instanceof Error
            ? error
            : new Error("Error finding affiliate PDA"),
        data: null,
      };
    }
  };

  // Find merchant PDA
  const findMerchantPDA = async (authority: PublicKey) => {
    if (!state.sdk) {
      return {
        loading: false,
        error: new Error("SDK not initialized"),
        data: null,
      };
    }

    try {
      const data = await state.sdk.findMerchantPDA(authority);
      return {
        loading: false,
        error: null,
        data,
      };
    } catch (error) {
      return {
        loading: false,
        error:
          error instanceof Error
            ? error
            : new Error("Error finding merchant PDA"),
        data: null,
      };
    }
  };

  // Utility functions
  const solToLamports = (sol: number): BN => {
    if (!state.sdk) {
      throw new Error("SDK not initialized");
    }
    return state.sdk.solToLamports(sol);
  };

  const lamportsToSol = (lamports: BN | number): number => {
    if (!state.sdk) {
      throw new Error("SDK not initialized");
    }
    return state.sdk.lamportsToSol(lamports);
  };

  return {
    ...state,
    // Core operations
    registerAffiliate,
    registerMerchant,
    processReferralSol,
    processReferralToken,
    updateMerchantCommission,
    toggleMerchantStatus,

    // Data fetching
    getAffiliateData,
    getMerchantData,
    getReferralData,
    getAffiliateReferrals,
    getMerchantReferrals,

    // PDAs
    findAffiliatePDA,
    findMerchantPDA,

    // Utilities
    solToLamports,
    lamportsToSol,
  };
}
