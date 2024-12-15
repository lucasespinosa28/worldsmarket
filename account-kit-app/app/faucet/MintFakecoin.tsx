"use client";
import {
    type UseSendUserOperationResult,
    useSendUserOperation,
    useSmartAccountClient,
} from "@account-kit/react";
import { encodeFunctionData, parseAbi,parseEther } from "viem";
const fakecoin = {
    abi: parseAbi(["function mint(address,uint256)","function balanceOf(address account)"]),
    address:process.env.NEXT_PUBLIC_FAKECOIN as `0x${string}`,
}
export default function MintFakecoin() {
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
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold mb-4 py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={() => {
                if (!client) return;
                const mintData = encodeFunctionData({
                    abi: fakecoin.abi,
                    functionName: "mint",
                    args: [client.account.address as `0x${string}`,parseEther("100")],
                });
                sendUserOperation({
                    uo: [
                        {
                            target: fakecoin.address,
                            data: mintData,
                        },
                    ],
                })
            }}
            disabled={isSendingUserOperation}
        >
            {isSendingUserOperation ? "Minting..." : "Mint fake coin"}
        </button>
    </div>)
}