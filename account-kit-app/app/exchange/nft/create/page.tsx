"use client";
import { useState, useEffect } from 'react';
import { useSendUserOperation, useSmartAccountClient } from "@account-kit/react";
import { getNFTData } from '@/app/profile/getNFTData';
import AssetExchange from '../AssetExchange';
import { encodeFunctionData, parseAbi, parseEther } from 'viem';
//  function approve(address to, uint256 tokenId) external;
// function setApprovalForAll(address operator, bool approved) external;
interface NFTInfo {
    nftAddress: string;
    tokenId: string;
    amount: string;
    isERC721: boolean;
}

const ERC1155 = {
    abi: parseAbi(["function setApprovalForAll(address,bool)"])
}
const ERC712 = {
    abi: parseAbi(["function approve(address,uint256)"])
}
export default function NftCreate() {
    const [nfts, setNfts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedNFTs, setSelectedNFTs] = useState<NFTInfo[]>([]);
    const { client } = useSmartAccountClient({ type: "LightAccount" });
    const [tokenAddress, setTokenAddress] = useState<`0x${string}`>(process.env.NEXT_PUBLIC_FAKECOIN as `0x${string}` || "0x");
    const [price, setPrice] = useState("");

    useEffect(() => {
        async function fetchNFTs() {
            try {
                const nftData = await getNFTData("0x22699f509c3a5b09620a27b686d6f0aa91b77907");
                console.log({ nftData: nftData[10] });
                setNfts(nftData);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching NFT data:', err);
                setError('Failed to fetch NFT data');
                setLoading(false);
            }
        }

        fetchNFTs();
    }, [client]);

    const handleNFTClick = (nft) => {
        const nftInfo: NFTInfo = {
            nftAddress: nft.contractAddress,
            tokenId: nft.tokenId,
            amount: nft.balance,
            isERC721: nft.tokenType === 'ERC721'
        };

        setSelectedNFTs(prevSelected => {
            const index = prevSelected.findIndex(
                item => item.nftAddress === nftInfo.nftAddress && item.tokenId === nftInfo.tokenId
            );
            if (index > -1) {
                // NFT is already selected, remove it
                return prevSelected.filter((_, i) => i !== index);
            } else {
                // NFT is not selected, add it
                return [...prevSelected, nftInfo];
            }
        });
    };

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



    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!client) return;
    
        const formattedNFTs = selectedNFTs.map(nft => ({
            nftAddress: nft.nftAddress as `0x${string}`,
            tokenId: BigInt(nft.tokenId),
            amount: BigInt(nft.amount),
            isERC721: nft.isERC721
        }));
        console.log({ formattedNFTs });
        const approvalOperations = selectedNFTs.flatMap(nft => {
            if (nft.isERC721) {
                return [{
                    target: nft.nftAddress as `0x${string}`,
                    data: encodeFunctionData({
                        abi: ERC712.abi,
                        functionName: "approve",
                        args: [AssetExchange.address as `0x${string}`, BigInt(nft.tokenId)],
                    }),
                }];
            } else {
                return [{
                    target: nft.nftAddress as `0x${string}`,
                    data: encodeFunctionData({
                        abi: ERC1155.abi,
                        functionName: "setApprovalForAll",
                        args: [AssetExchange.address as `0x${string}`, true],
                    }),
                }];
            }
        });
        console.log({ approvalOperations });
        console.log({AssetExchange})
        console.log({formattedNFTs})
        sendUserOperation({
            uo: [
                ...approvalOperations,
                {
                    target: AssetExchange.address as `0x${string}`,
                    data: encodeFunctionData({
                        abi: AssetExchange.abi,
                        functionName: "createBox",
                        args: [
                            formattedNFTs,
                            [{
                                token: tokenAddress,
                                price: parseEther(price)
                            }]
                        ],
                    }),
                },
            ],
        });
    };

    if (loading) return <div>Loading NFTs...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1>NFT Create</h1>
            <h2>Your NFTs:</h2>
            <ul>
                {nfts.map((nft, index) => {
                    const isSelected = selectedNFTs.some(
                        item => item.nftAddress === nft.contractAddress && item.tokenId === nft.tokenId
                    );
                    return (
                        <li
                            key={index}
                            onClick={() => handleNFTClick(nft)}
                            style={{
                                cursor: 'pointer',
                                border: isSelected ? '2px solid blue' : '1px solid gray',
                                padding: '10px',
                                margin: '10px 0',
                                borderRadius: '5px'
                            }}
                        >
                            <p>Contract Address: {nft.contractAddress}</p>
                            <p>Token ID: {nft.tokenId}</p>
                            <p>Token balance: {nft.balance}</p>
                            <p>Token Type: {nft.tokenType}</p>
                            <p>
                                Selected: {isSelected ? 'Yes' : 'No'}
                            </p>
                        </li>
                    );
                })}
            </ul>
            <form onSubmit={handleSubmit} className="space-y-4">
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
            <ul>
                {selectedNFTs.map((nft, index) => (
                    <li key={index}>
                        <p>NFT Address: {nft.nftAddress}</p>
                        <p>Token ID: {nft.tokenId}</p>
                        <p>Amount: {nft.amount}</p>
                        <p>Is ERC721: {nft.isERC721 ? 'Yes' : 'No'}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}