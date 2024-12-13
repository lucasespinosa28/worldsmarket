import { AlchemyAccountsUIConfig, createConfig } from "@account-kit/react";
import { alchemy, shapeSepolia } from "@account-kit/infra";
import { QueryClient } from "@tanstack/react-query";

if (!process.env.NEXT_PUBLIC_ALCHEMY_API_KEY) {
    throw new Error("Missing NEXT_PUBLIC_ALCHEMY_API_KEY environment variable");
  }
  if (!process.env.NEXT_PUBLIC_POLICY_ID) {
    throw new Error("Missing NEXT_PUBLIC_POLICY_ID environment variable");
  }

const uiConfig: AlchemyAccountsUIConfig = {
    illustrationStyle: "outline",
    auth: {
        sections: [
            [{ "type": "email" }],
            [{ "type": "passkey" }, {
                "type": "social",
                "authProviderId": "google",
                "mode": "popup",
            }, {
                "type": "social",
                "authProviderId": "facebook",
                "mode": "popup",
            }],
            [{
                "type": "external_wallets",
                "walletConnect": { "projectId": "your-project-id" },
            }],
        ],
        addPasskeyOnSignup: false,
    },
};

export const config = createConfig({
    // if you don't want to leak api keys, you can proxy to a backend and set the rpcUrl instead here
    // get this from the app config you create at https://dashboard.alchemy.com/accounts?utm_source=demo_alchemy_com&utm_medium=referral&utm_campaign=demo_to_dashboard
    transport: alchemy({
        apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || "",
    }),
    chain: shapeSepolia,
    policyId: process.env.NEXT_PUBLIC_POLICY_ID,
    ssr: true, // set to false if you're not using server-side rendering
    enablePopupOauth: true,
}, uiConfig);

export const queryClient = new QueryClient();
