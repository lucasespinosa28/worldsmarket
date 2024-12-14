import { useSmartAccountClient } from '@account-kit/react';
import { useEffect, useState } from 'react';
import { parseAbi } from 'viem';
import AssetExchange from '../exchange/nft/AssetExchange';

interface BoxCreation {
    boxId: string;
    owner: string;
    blockTimestamp: string;
}

interface NFTInfo {
    nftAddress: `0x${string}`;
    tokenId: bigint;
    amount: bigint;
    isERC721: boolean;
}

interface TokenInfo {
    token: `0x${string}`;
    price: bigint;
}

const BOX_CREATIONS_QUERY = `
  query GetBoxCreations {
    boxCreateds(skip: 0, first: 100) {
      boxId
      owner
      blockTimestamp
    }
  }
`;

const AssetExchangeABI = parseAbi([
    "function getNFTInfos(uint256)",
    "function getTokenInfos(uint256)"
]);

async function getBoxDetails(boxId: string, client: any) {
    if (!client) {
        throw new Error("Smart account client is not available");
    }
    try {
        const nftInfos: NFTInfo[] = await client.readContract({
            address: AssetExchange.address as `0x${string}`,
            abi: AssetExchange.abi,
            functionName: 'getNFTInfos',
            args: [BigInt(boxId)],
        });

        const tokenInfos: TokenInfo[] = await client.readContract({
            address: AssetExchange.address as `0x${string}`,
            abi: AssetExchange.abi,
            functionName: 'getTokenInfos',
            args: [BigInt(boxId)],
        });

        console.log('Raw NFT Infos:', nftInfos);
        console.log('Raw Token Infos:', tokenInfos);

        if (!nftInfos || !tokenInfos) {
            throw new Error('Contract returned undefined values');
        }

        return {
            nftInfos: nftInfos.map(nft => ({
                nftAddress: nft.nftAddress,
                tokenId: nft.tokenId.toString(),
                amount: nft.amount.toString(),
                isERC721: nft.isERC721
            })),
            tokenInfos: tokenInfos.map(token => ({
                token: token.token,
                price: token.price.toString()
            }))
        };
    } catch (error) {
        console.error('Error fetching box details:', error);
        return { error: `Failed to fetch box details: ${error.message}` };
    }
}
export default function BoxCreations() {
    const { client } = useSmartAccountClient({ type: "LightAccount" });
    const [boxCreations, setBoxCreations] = useState<BoxCreation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [boxDetails, setBoxDetails] = useState<{ [boxId: string]: any }>({});

    useEffect(() => {
        async function fetchBoxCreations() {
            try {
                const response = await fetch(process.env.NEXT_PUBLIC_SUBGRAPH_ASSETEXCHANGE as string, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ query: BOX_CREATIONS_QUERY }),
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const json = await response.json();
                setBoxCreations(json.data.boxCreateds);

                // Fetch details for each box
                const details = await Promise.all(
                    json.data.boxCreateds.map(async (creation: BoxCreation) => {
                        const detail = await getBoxDetails(creation.boxId, client);
                        return { [creation.boxId]: detail };
                    })
                );

                setBoxDetails(Object.assign({}, ...details));
                setLoading(false);
            } catch (err) {
                console.error('Error fetching box creation data:', err);
                setError('Failed to fetch box creation data');
                setLoading(false);
            }
        }

        if (client) {
            fetchBoxCreations();
        }
    }, [client]);

    if (loading) return <p>Loading box creations...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Box Creations</h2>
            {boxCreations.length === 0 ? (
                <p>No box creations found.</p>
            ) : (
                <ul className="space-y-4">
                    {boxCreations.map((creation) => (
                        <li key={creation.boxId} className="border p-4 rounded-lg">
                            <p><strong>Box ID:</strong> {creation.boxId}</p>
                            <p><strong>Owner:</strong> {creation.owner}</p>
                            <p><strong>Timestamp:</strong> {new Date(parseInt(creation.blockTimestamp) * 1000).toLocaleString()}</p>
                            {boxDetails[creation.boxId] && (
                                <div>
                                    {boxDetails[creation.boxId].error ? (
                                        <p className="text-red-500">Error: {boxDetails[creation.boxId].error}</p>
                                    ) : (
                                        <>
                                            <h3 className="font-bold mt-2">NFT Infos:</h3>
                                            <pre>{JSON.stringify(boxDetails[creation.boxId].nftInfos, null, 2)}</pre>
                                            <h3 className="font-bold mt-2">Token Infos:</h3>
                                            <pre>{JSON.stringify(boxDetails[creation.boxId].tokenInfos, null, 2)}</pre>
                                        </>
                                    )}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}