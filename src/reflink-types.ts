/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/reflink.json`.
 */
export type Reflink = {
  address: "4PpiC9e179ufENLcgmK5NQJKHZ48NepLguqCJPsnBT9A";
  metadata: {
    name: "reflink";
    version: "0.1.0";
    spec: "0.1.0";
    description: "Created with Anchor";
  };
  instructions: [
    {
      name: "registerAffiliate";
      discriminator: [87, 121, 99, 184, 126, 63, 103, 217];
      accounts: [
        {
          name: "affiliate";
          writable: true;
          signer: true;
        },
        {
          name: "authority";
          writable: true;
          signer: true;
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [];
    },
    {
      name: "registerMerchant";
      discriminator: [238, 245, 77, 132, 161, 88, 216, 248];
      accounts: [
        {
          name: "merchant";
          writable: true;
          signer: true;
        },
        {
          name: "authority";
          writable: true;
          signer: true;
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "commissionBps";
          type: "u16";
        }
      ];
    },
    {
      name: "registerReferralSol";
      discriminator: [42, 231, 92, 85, 242, 38, 111, 91];
      accounts: [
        {
          name: "affiliate";
          writable: true;
        },
        {
          name: "referral";
          writable: true;
          signer: true;
        },
        {
          name: "merchant";
        },
        {
          name: "merchantWallet";
          docs: [
            "The wallet that will receive the merchant's portion of the payment"
          ];
          writable: true;
        },
        {
          name: "affiliateWallet";
          docs: ["The wallet that will receive the affiliate's commission"];
          writable: true;
        },
        {
          name: "payer";
          docs: ["The wallet that is making the payment"];
          writable: true;
          signer: true;
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        }
      ];
    },
    {
      name: "registerReferralToken";
      discriminator: [50, 215, 2, 53, 56, 216, 151, 55];
      accounts: [
        {
          name: "affiliate";
          writable: true;
        },
        {
          name: "referral";
          writable: true;
          signer: true;
        },
        {
          name: "merchant";
        },
        {
          name: "tokenMint";
          docs: ["The token mint being used for payment"];
        },
        {
          name: "merchantTokenAccount";
          docs: ["The merchant's token account that will receive payment"];
          writable: true;
        },
        {
          name: "affiliateTokenAccount";
          docs: ["The affiliate's token account that will receive commission"];
          writable: true;
        },
        {
          name: "payerTokenAccount";
          docs: ["The payer's token account"];
          writable: true;
        },
        {
          name: "payer";
          docs: ["The wallet that is making the payment"];
          writable: true;
          signer: true;
        },
        {
          name: "tokenProgram";
          address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        }
      ];
    },
    {
      name: "toggleMerchantStatus";
      discriminator: [251, 186, 166, 45, 108, 107, 186, 170];
      accounts: [
        {
          name: "merchant";
          writable: true;
        },
        {
          name: "authority";
          signer: true;
        }
      ];
      args: [];
    },
    {
      name: "updateMerchantCommission";
      discriminator: [77, 99, 119, 206, 140, 212, 161, 195];
      accounts: [
        {
          name: "merchant";
          writable: true;
        },
        {
          name: "authority";
          signer: true;
        }
      ];
      args: [
        {
          name: "newCommissionBps";
          type: "u16";
        }
      ];
    }
  ];
  accounts: [
    {
      name: "affiliate";
      discriminator: [136, 95, 107, 149, 36, 195, 146, 35];
    },
    {
      name: "merchant";
      discriminator: [71, 235, 30, 40, 231, 21, 32, 64];
    },
    {
      name: "referral";
      discriminator: [30, 235, 136, 224, 106, 107, 49, 64];
    }
  ];
  errors: [
    {
      code: 6000;
      name: "invalidCommissionRate";
      msg: "Invalid commission rate.";
    },
    {
      code: 6001;
      name: "unauthorized";
      msg: "Unauthorized.";
    },
    {
      code: 6002;
      name: "invalidAffiliate";
      msg: "Invalid affiliate.";
    },
    {
      code: 6003;
      name: "calculationError";
      msg: "Calculation error.";
    },
    {
      code: 6004;
      name: "inactiveMerchant";
      msg: "Merchant is not active.";
    }
  ];
  types: [
    {
      name: "affiliate";
      type: {
        kind: "struct";
        fields: [
          {
            name: "authority";
            type: "pubkey";
          },
          {
            name: "totalEarned";
            type: "u64";
          },
          {
            name: "totalReferrals";
            type: "u64";
          }
        ];
      };
    },
    {
      name: "merchant";
      type: {
        kind: "struct";
        fields: [
          {
            name: "authority";
            type: "pubkey";
          },
          {
            name: "commissionBps";
            type: "u16";
          },
          {
            name: "active";
            type: "bool";
          }
        ];
      };
    },
    {
      name: "referral";
      type: {
        kind: "struct";
        fields: [
          {
            name: "affiliate";
            type: "pubkey";
          },
          {
            name: "merchant";
            type: "pubkey";
          },
          {
            name: "amount";
            type: "u64";
          },
          {
            name: "commission";
            type: "u64";
          },
          {
            name: "timestamp";
            type: "i64";
          },
          {
            name: "isToken";
            type: "bool";
          },
          {
            name: "tokenMint";
            type: "pubkey";
          }
        ];
      };
    }
  ];
};
