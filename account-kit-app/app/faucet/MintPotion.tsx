"use client";
import Image from 'next/image';
import { useState } from 'react';
import {
    type UseSendUserOperationResult,
    useSendUserOperation,
    useSmartAccountClient,
} from "@account-kit/react";
import { encodeFunctionData, parseAbi, parseEther } from "viem";

const Potion = {
    abi: parseAbi(["function mint(address,uint256,uint256)"]),
    address: process.env.NEXT_PUBLIC_POTION as `0x${string}`,
}

export default function MintPotion() {
    const { client } = useSmartAccountClient({ type: "LightAccount" });
    const { sendUserOperation, isSendingUserOperation } = useSendUserOperation({
        client,
        waitForTxn: true,
        onSuccess: ({ hash, request }) => {
            console.log("Transaction sent successfully:", hash, request);
        },
        onError: (error) => {
            console.error("Error sending UO:", error.cause);
        },
    });

    const images = Array.from({ length: 10 }, (_, i) => `/potions/fantasy_0000${i}_.png`);
    const [selectedImages, setSelectedImages] = useState<number[]>([]);

    const toggleImageSelection = (index: number) => {
        setSelectedImages(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    const mintSelectedPotions = () => {
        console.log("Minting selected potions:", selectedImages);
        if (!client) return;
       
        const uoArray = selectedImages.map(index => ({
            target: Potion.address,
            data: encodeFunctionData({
                abi: Potion.abi,
                functionName: "mint",
                args: [client.account.address as `0x${string}`, BigInt(index), 100n],
            }),
        }));
        console.log("Making UOs:", );
        sendUserOperation({ uo: uoArray });
    };
    return (
        <div>
            <div className="grid grid-cols-4 gap-3 mb-4">
                {images.map((src, index) => (
                    <div
                        key={index}
                        className={`cursor-pointer relative w-64 h-64 shadow-lg rounded-lg overflow-hidden ${
                            selectedImages.includes(index)
                                ? 'ring-8 ring-blue-500'
                                : 'ring-1 ring-gray-300'
                        }`}
                        onClick={() => toggleImageSelection(index)}
                    >
                        <div className="absolute inset-2 bg-gray-100 rounded-md overflow-hidden">
                            <Image
                                src={src}
                                alt={`Fantasy image ${index + 1}`}
                                layout="fill"
                                objectFit="cover"
                            />
                        </div>
                    </div>
                ))}
            </div>
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={mintSelectedPotions}
                disabled={isSendingUserOperation || selectedImages.length === 0}
            >
                {isSendingUserOperation ? "Minting..." : `Mint ${selectedImages.length} erc1155 potion NFT${selectedImages.length !== 1 ? 's' : ''}`}
            </button>
        </div>
    )
}