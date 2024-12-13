import {
  AlchemyAccountsUIConfig,
  cookieStorage,
  createConfig,
} from "@account-kit/react";
import { alchemy, arbitrumSepolia, shapeSepolia } from "@account-kit/infra";
import { QueryClient } from "@tanstack/react-query";

// if (!process.env.NEXT_PUBLIC_ALCHEMY_API_KEY) {
//   throw new Error("Missing NEXT_PUBLIC_ALCHEMY_API_KEY environment variable");
// }
// if (!process.env.NEXT_PUBLIC_POLICY_ID) {
//   throw new Error("Missing NEXT_PUBLIC_POLICY_ID environment variable");
// }


const uiConfig: AlchemyAccountsUIConfig = {
  illustrationStyle: "outline",
  auth: {
    sections: [
      [{ type: "email" }],
      [
        { type: "passkey" },
        // { type: "social", authProviderId: "google", mode: "popup" },
        // { type: "social", authProviderId: "facebook", mode: "popup" },
      ],
      // [
      //   {
      //     type: "external_wallets",
      //     walletConnect: { projectId: "your-project-id" },
      //   },
      // ],
    ],
    addPasskeyOnSignup: true,
  },
};

export const config = createConfig(
  {
    transport: alchemy({ apiKey: "ClZTukxQE_5KVGMr3kwMFXmSoJMG2onf" }),
    chain: shapeSepolia,
    policyId: "0e838d5c-473d-481a-83f5-f3bbcf5f4de1",
    ssr: true, // more about ssr: https://accountkit.alchemy.com/react/ssr
    storage: cookieStorage, // more about persisting state with cookies: https://accountkit.alchemy.com/react/ssr#persisting-the-account-state
    enablePopupOauth: true, // must be set to "true" if you plan on using popup rather than redirect in the social login flow
    sessionConfig: {
      expirationTimeMs: 1000 * 60 * 60 * 24 * 3, // 3 days
    },
  },
  uiConfig
);

export const queryClient = new QueryClient();