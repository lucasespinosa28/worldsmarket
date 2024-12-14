import { useSendUserOperation, useSmartAccountClient } from '@account-kit/react';
import { useEffect, useState } from 'react';
import { encodeFunctionData, formatEther, parseAbi } from 'viem';

const ContractOwnershipMarket = {
    abi: parseAbi(["function purchaseListedContract(address)", "function cancelContractListing(address)"]),
    address: process.env.NEXT_PUBLIC_CONTRACTOWNERSHIPMARKET,
}

const erc20 = {
    abi: parseAbi(["function approve(address, uint256)"]),
}
interface ContractListing {
    id: string;
    contractAddress: string;
    owner: string;
    token: string;
    price: string;
    blockTimestamp: string;
}

const QUERY = `
  query GetContractListings {
    contractListeds(skip: 0, first: 100) {
      id
      contractAddress
      owner
      token
      price
      blockTimestamp
    }
  }
`;

export default function ContractListings() {
    const [listings, setListings] = useState<ContractListing[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(process.env.NEXT_PUBLIC_SUBGRAPH_ONTRACTOWNERSHIPMARKET as string, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ query: QUERY }),
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const json = await response.json();
                setListings(json.data.contractListeds);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to fetch listings');
                setLoading(false);
            }
        }

        fetchData();
    }, []);

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

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h2>Contract Listings</h2>
            <ul>
                {listings.map((listing) => (
                    <li key={listing.id}>
                        <p>Contract Address: {listing.contractAddress}</p>
                        <p>Owner: {listing.owner}</p>
                        <p>Token: {listing.token}</p>
                        <p>Price: {formatEther(BigInt(listing.price))}</p>
                        <p>Timestamp: {new Date(parseInt(listing.blockTimestamp) * 1000).toLocaleString()}</p>
                        <button
                            className={`
                                bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded
                                focus:outline-none focus:shadow-outline mb-4 mr-2
                            `}
                            onClick={() => {
                                if (!client) return;
                                sendUserOperation({
                                    uo: [
                                        {
                                            target: listing.token as `0x${string}`,
                                            data: encodeFunctionData({
                                                abi: erc20.abi,
                                                functionName: "approve",
                                                args: [ContractOwnershipMarket.address as `0x${string}`, BigInt(listing.price)],
                                            }),
                                        },
                                        {
                                            target: ContractOwnershipMarket.address as `0x${string}`,
                                            data: encodeFunctionData({
                                                abi: ContractOwnershipMarket.abi,
                                                functionName: "purchaseListedContract",
                                                args: [listing.contractAddress as `0x${string}`],
                                            }),
                                        },
                                    ],
                                })
                            }}
                            disabled={isSendingUserOperation}
                        >
                            {isSendingUserOperation ? "Buying..." : "Buy contract"}
                        </button>
                        {client?.account.address === listing.owner && (
                            <button
                                className={`
                                    bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded
                                    focus:outline-none focus:shadow-outline mb-4
                                `}
                                onClick={() => {
                                    if (!client) return;
                                    sendUserOperation({
                                        uo: [
                                            {
                                                target: ContractOwnershipMarket.address as `0x${string}`,
                                                data: encodeFunctionData({
                                                    abi: ContractOwnershipMarket.abi,
                                                    functionName: "cancelContractListing",
                                                    args: [listing.contractAddress as `0x${string}`],
                                                }),
                                            },
                                        ],
                                    })
                                }}
                                disabled={isSendingUserOperation}
                            >
                                {isSendingUserOperation ? "Canceling..." : "Cancel listing"}
                            </button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}