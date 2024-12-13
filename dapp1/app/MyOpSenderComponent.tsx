import {
    type UseSendUserOperationResult,
    useSendUserOperation,
    useSmartAccountClient,
} from "@account-kit/react";
import { encodeFunctionData, parseAbi } from "viem";


export default function MyOpSenderComponent() {
    const { client } = useSmartAccountClient({ type: "LightAccount" });
    const { sendUserOperation, isSendingUserOperation } = useSendUserOperation({
        client,
        waitForTxn: true,
        onSuccess: ({ hash, request }) => {
        },
        onError: (error) => {
            console.error("Error sending UO:", error);
        },
    });
    const contractAddress = "0xAA394da7d62E502a7E3dA7e11d21A74c277143d5";
    function handlemint() {
        if (!client || !client.account.address) return;
        const abi = parseAbi(["function mint(address)"]);
        const mintData = encodeFunctionData({
            abi: abi,
            functionName: "mint",
            args: [client.account.address as `0x${string}`],
        });

        sendUserOperation({
            uo: [
                {
                    target: contractAddress,
                    data: mintData,
                },
                {
                    target: contractAddress,
                    data: mintData,
                },
            ],
        })
    }

    return (<div>
        <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handlemint}
            disabled={isSendingUserOperation}
        >
            {isSendingUserOperation ? "Sending..." : "Send UO"}
        </button>
    </div>)
}