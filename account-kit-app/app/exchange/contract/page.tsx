"use client";
import { useState } from "react";
import { useSendUserOperation, useSmartAccountClient } from "@account-kit/react";
import { encodeFunctionData, parseAbi, parseEther } from "viem/utils"
import ContractListings from "@/app/components/ContractListings";
import ContractPurchases from "@/app/components/ContractPurchases";

const contractToSell = {
    abi: parseAbi(["function transferOwnership(address)"]),
    address: process.env.NEXT_PUBLIC_COUNTERFACTORY as `0x${string}`,
}

const ContractOwnershipMarket = {
    abi: parseAbi(["function listContractForSale(address,address,uint256)",
        "function activateContractListing(address)",
        "function cancelContractListing(address)"]),
    address: process.env.NEXT_PUBLIC_CONTRACTOWNERSHIPMARKET,
}

export default function Contract() {
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

    const [contractAddress, setContractAddress] = useState<`0x${string}`>("0x");
    const [tokenAddress, setTokenAddress] = useState<`0x${string}`>(process.env.NEXT_PUBLIC_FAKECOIN as `0x${string}` || "0x");
    const [price, setPrice] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!client) return;
        sendUserOperation({
            uo: [
                {
                    target: ContractOwnershipMarket.address as `0x${string}`,
                    data: encodeFunctionData({
                        abi: ContractOwnershipMarket.abi,
                        functionName: "listContractForSale",
                        args: [contractAddress, tokenAddress, parseEther(price)],
                    }),
                },
                {
                    target: contractAddress as `0x${string}`,
                    data: encodeFunctionData({
                        abi: contractToSell.abi,
                        functionName: "transferOwnership",
                        args: [ContractOwnershipMarket.address as `0x${string}`],
                    }),
                },
                {
                    target: ContractOwnershipMarket.address as `0x${string}`,
                    data: encodeFunctionData({
                        abi: ContractOwnershipMarket.abi,
                        functionName: "activateContractListing",
                        args: [contractAddress],
                    }),
                },
            ],
        });
    };
    return (
        <div>
            <h1>Sell contract</h1>
            <div>
                <h2>List Contract For Sale</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="contractAddress" className="block text-sm font-medium text-gray-700">Contract Address</label>
                        <input
                            type="text"
                            id="contractAddress"
                            value={contractAddress}
                            onChange={(e) => setContractAddress(e.target.value as `0x${string}`)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                                           focus:border-indigo-300 focus:ring focus:ring-indigo-200 
                                           focus:ring-opacity-50"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="tokenAddress" className="block text-sm font-medium text-gray-700">Token Address</label>
                        <input
                            type="text"
                            id="tokenAddress"
                            value={tokenAddress}
                            onChange={(e) => setTokenAddress(e.target.value as `0x${string}`)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                            focus:border-indigo-300 focus:ring focus:ring-indigo-200 
                            focus:ring-opacity-50"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                        <input
                            type="number"
                            id="price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                                           focus:border-indigo-300 focus:ring focus:ring-indigo-200 
                                           focus:ring-opacity-50"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        disabled={isSendingUserOperation}
                    >
                        {isSendingUserOperation ? "Listing..." : "List Contract"}
                    </button>
                </form>
            </div>
            <div>
                <h2>purchaseListedContract</h2>
                <ContractListings />
                <ContractPurchases />
            </div>
        </div>
    )
}

//0x35420a9d74f44c9254f5d6259b778f155bc25569