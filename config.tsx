import {
    AlchemyAccountsUIConfig,
    cookieStorage,
    createConfig, useAuthContext,
} from "@account-kit/react";
import {alchemy, arbitrumSepolia, defineAlchemyChain, mainnet} from "@account-kit/infra";
import { QueryClient } from "@tanstack/react-query";

import { defineChain } from 'viem'

export const hype = defineChain({
    id: 999,
    name: 'Hype',
    nativeCurrency: {
        decimals: 18,
        name: 'Hype',
        symbol: 'HYPE',
    },
    rpcUrls: {
        default: {
            http: ['https://hyperliquid-mainnet.g.alchemy.com/v2/API_KEY'],
            webSocket: ['wss://hyperliquid-mainnet.g.alchemy.com/v2/API_KEY'],
        },
    },
    blockExplorers: {
        default: { name: 'Explorer', url: 'https://hyperevmscan.io/' },
    }
})

const API_KEY = "API_KEY";
if (!API_KEY) {
  throw new Error("NEXT_PUBLIC_ALCHEMY_API_KEY is not set");
}


const SPONSORSHIP_POLICY_ID = "ec0c4a5b-66e5-44be-888c-ba492f063df3";
if (!SPONSORSHIP_POLICY_ID) {
  throw new Error("NEXT_PUBLIC_ALCHEMY_POLICY_ID is not set");
}

const chain = defineAlchemyChain({
    chain: hype,
    rpcBaseUrl: `https://hyperliquid-mainnet.g.alchemy.com/v2/API_KEY`,
});


const uiConfig: AlchemyAccountsUIConfig = {
  illustrationStyle: "outline",
  auth: {
    sections: [
      [{ type: "email" }],
      [
        { type: "passkey" },
        { type: "social", authProviderId: "google", mode: "popup" },
        { type: "social", authProviderId: "facebook", mode: "popup" },
      ],
        [
            {
                type: "external_wallets"
            },
        ]

    ],
    addPasskeyOnSignup: false,
    //header: <img src={DunbackMeadow_walletConnectLogo} width="200px" height="200px" alt="DunbackMeadow Logo" />,
  },
};

export const config = createConfig(
  {
    transport: alchemy({ apiKey: "API_KEY" }),
    chain: chain,
    ssr: true, // more about ssr: https://www.alchemy.com/docs/wallets/react/ssr
    storage: cookieStorage, // more about persisting state with cookies: https://www.alchemy.com/docs/wallets/react/ssr#persisting-the-account-state
    enablePopupOauth: true, // must be set to "true" if you plan on using popup rather than redirect in the social login flow
    policyId: "policy_id",
  },
  uiConfig
);



export const queryClient = new QueryClient();
