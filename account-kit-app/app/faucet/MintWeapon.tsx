"use client";
import {
    type UseSendUserOperationResult,
    useSendUserOperation,
    useSmartAccountClient,
} from "@account-kit/react";
import { encodeFunctionData, parseAbi,parseEther } from "viem";
const weapon = {
    abi: parseAbi(["function safeMint(address)"]),
    address:process.env.NEXT_PUBLIC_WEAPON as `0x${string}`,
}
export default function MintWeapon() {
    const { client } = useSmartAccountClient({ type: "LightAccount" });
    const { sendUserOperation, isSendingUserOperation } = useSendUserOperation({
        client,
        waitForTxn: true,
        onSuccess: ({ hash, request }) => {
            console.log("Transaction sent successfully:", hash, request);
        },
        onError: (error) => {
            console.error("Error sending UO:", error);
        },
    });
    return (<div>
        <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={() => {
                if (!client) return;
                const mintData = encodeFunctionData({
                    abi: weapon.abi,
                    functionName: "safeMint",
                    args: [client.account.address as `0x${string}`],
                });
                sendUserOperation({
                    uo: [
                        {
                            target: weapon.address,
                            data: mintData,
                        },
                    ],
                })
            }}
            disabled={isSendingUserOperation}
        >
            {isSendingUserOperation ? "Minting..." : "Mint random weapon"}
        </button>
    </div>)
}