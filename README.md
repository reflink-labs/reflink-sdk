# Reflink SDK

A Solana-based affiliate and referral program SDK for managing merchant-affiliate relationships and processing referral payments in SOL and SPL tokens.

## Overview

Reflink SDK provides a simple way to implement affiliate marketing programs on the Solana blockchain, allowing:

- Merchants to register and set commission rates
- Affiliates to register and earn commissions
- Processing referral payments in both SOL and SPL tokens
- Tracking all referral transactions on-chain

## Features

- ✅ Register as an affiliate
- ✅ Register as a merchant with configurable commission rates
- ✅ Process referral payments in SOL
- ✅ Process referral payments in SPL tokens
- ✅ Update merchant commission rates
- ✅ Toggle merchant active status
- ✅ Fetch affiliate and merchant data
- ✅ Get referral history for merchants and affiliates

## Installation

```bash
npm install reflink-sdk
# or
yarn add reflink-sdk
```

## Getting Started

### Initialization

```typescript
import { Connection, Keypair } from "@solana/web3.js";
import { Wallet } from "@coral-xyz/anchor";
import ReflinkSDK from "reflink-sdk";

// Create a wallet from a keypair
const keypair = Keypair.generate(); // Or load from elsewhere
const wallet = new Wallet(keypair);

// Connect to Solana
const connection = new Connection("https://api.devnet.solana.com", "confirmed");

// Initialize the SDK
const reflinkSDK = new ReflinkSDK(connection, wallet);
```

### Using with React and Wallet Adapter

```typescript
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from "@solana/web3.js";
import { Wallet } from "@coral-xyz/anchor";
import ReflinkSDK from "reflink-sdk";

function MyComponent() {
  const wallet = useWallet();
  const connection = new Connection("https://api.devnet.solana.com", "confirmed");
  
  const sdk = new ReflinkSDK(connection, wallet as unknown as Wallet);
  
  // Now you can use sdk methods...
}
```

## Usage Examples

### Register as an Affiliate

```typescript
const registerAffiliate = async () => {
  try {
    const txSignature = await reflinkSDK.registerAffiliate();
    console.log("Successfully registered as affiliate:", txSignature);
    return txSignature;
  } catch (error) {
    console.error("Failed to register as affiliate:", error);
    throw error;
  }
};
```

### Register as a Merchant

```typescript
const registerMerchant = async (commissionBps = 500) => { // 5% commission
  try {
    const txSignature = await reflinkSDK.registerMerchant(commissionBps);
    console.log("Successfully registered as merchant:", txSignature);
    return txSignature;
  } catch (error) {
    console.error("Failed to register as merchant:", error);
    throw error;
  }
};
```

### Process SOL Referral Payment

```typescript
const processSolReferral = async (
  merchantPubkey,
  affiliatePubkey,
  merchantWallet,
  affiliateWallet,
  amountSol
) => {
  try {
    const amount = reflinkSDK.solToLamports(amountSol);
    
    const txSignature = await reflinkSDK.processReferralSol(
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
```

### Process Token Referral Payment

```typescript
const processTokenReferral = async (
  merchantPubkey,
  affiliatePubkey,
  merchantTokenAccount,
  affiliateTokenAccount,
  tokenMint,
  amount
) => {
  try {
    const txSignature = await reflinkSDK.processReferralToken(
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
```

### Update Merchant Commission

```typescript
const updateCommission = async (merchantPubkey, newCommissionBps) => {
  try {
    const txSignature = await reflinkSDK.updateMerchantCommission(
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
```

### Toggle Merchant Status

```typescript
const toggleMerchantStatus = async (merchantPubkey) => {
  try {
    const txSignature = await reflinkSDK.toggleMerchantStatus(
      new PublicKey(merchantPubkey)
    );
    
    console.log("Successfully toggled merchant status:", txSignature);
    return txSignature;
  } catch (error) {
    console.error("Failed to toggle merchant status:", error);
    throw error;
  }
};
```

### Get Affiliate Data

```typescript
const getAffiliateData = async (affiliatePubkey) => {
  try {
    const data = await reflinkSDK.getAffiliateData(
      new PublicKey(affiliatePubkey)
    );
    console.log("Affiliate data:", data);
    return data;
  } catch (error) {
    console.error("Failed to fetch affiliate data:", error);
    throw error;
  }
};
```

### Get Referrals for an Affiliate

```typescript
const getAffiliateReferrals = async (affiliatePubkey) => {
  try {
    const referrals = await reflinkSDK.getAffiliateReferrals(
      new PublicKey(affiliatePubkey)
    );
    console.log("Affiliate referrals:", referrals);
    return referrals;
  } catch (error) {
    console.error("Failed to fetch affiliate referrals:", error);
    throw error;
  }
};
```

## React Integration

The SDK can be easily integrated with React applications using hooks:

```typescript
import { useReflinkSDK } from './useReflinkSDK';

function MyComponent() {
  const {
    registerAsAffiliate,
    registerAsMerchant,
    processSolReferral,
    processTokenReferral,
    updateCommission,
    toggleMerchantStatus,
    getAffiliateData,
    getAffiliateReferrals,
  } = useReflinkSDK();
  
  const handleRegisterAffiliate = async () => {
    try {
      const tx = await registerAsAffiliate();
      // Handle success
    } catch (error) {
      // Handle error
    }
  };
  
  // Rest of your component...
}
```

## Program Structure

The SDK interfaces with a Solana program that includes the following account types:

- `Affiliate`: Represents an affiliate account on-chain
- `Merchant`: Represents a merchant with commission settings
- `Referral`: Records a referral transaction between merchant and affiliate

## Development

### Prerequisites

- Node.js 14+
- Yarn or npm
- Solana CLI tools (for local development/testing)

### Local Setup

```bash
# Clone the repository
git clone https://github.com/reflink-labs/reflink-sdk.git
cd reflink-sdk

# Install dependencies
yarn install

# Build the SDK
yarn build
```

## License

MIT