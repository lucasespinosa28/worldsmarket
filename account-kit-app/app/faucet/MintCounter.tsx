"use client";
import {
    type UseSendUserOperationResult,
    useSendUserOperation,
    useSmartAccountClient,
} from "@account-kit/react";
import { encodeFunctionData, parseAbi, parseEther } from "viem";
import UserCounters from './UserCounters';
const counter = {
    abi: parseAbi(["function createCounter()", "function getUserCounters(address)"]),
    address: process.env.NEXT_PUBLIC_COUNTERFACTORY as `0x${string}`,
}

export default function MintCounter() {
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

    return (
        <div>
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4"
                onClick={() => {
                    if (!client) return;
                    const mintData = encodeFunctionData({
                        abi: counter.abi,
                        functionName: "createCounter",
                        args: [],
                    });
                    sendUserOperation({
                        uo: [
                            {
                                target: counter.address,
                                data: mintData,
                            },
                        ],
                    })
                }}
                disabled={isSendingUserOperation}
            >
                {isSendingUserOperation ? "Minting..." : "Mint contract"}
            </button>
            {client && <UserCounters address={client?.account.address}/>}
        </div>
    )
}