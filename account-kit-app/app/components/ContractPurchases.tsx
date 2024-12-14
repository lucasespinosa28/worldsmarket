import { useEffect, useState } from 'react';
import { formatEther } from 'viem';

interface ContractPurchase {
    id: string;
    contractAddress: string;
    buyer: string;
    price: string;
    blockTimestamp: string;
}

const PURCHASES_QUERY = `
  query GetContractPurchases {
    contractPurchaseds(skip: 0, first: 100) {
      id
      contractAddress
      buyer
      price
      blockTimestamp
    }
  }
`;

export default function ContractPurchases() {
    const [purchases, setPurchases] = useState<ContractPurchase[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchPurchases() {
            try {
                const response = await fetch(process.env.NEXT_PUBLIC_SUBGRAPH_ONTRACTOWNERSHIPMARKET as string, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ query: PURCHASES_QUERY }),
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const json = await response.json();
                setPurchases(json.data.contractPurchaseds);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching purchase data:', err);
                setError('Failed to fetch purchase data');
                setLoading(false);
            }
        }

        fetchPurchases();
    }, []);

    if (loading) return <p>Loading purchases...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Contract Purchases</h2>
            {purchases.length === 0 ? (
                <p>No purchases found.</p>
            ) : (
                <ul className="space-y-4">
                    {purchases.map((purchase) => (
                        <li key={purchase.id} className="border p-4 rounded-lg">
                            <p><strong>Contract Address:</strong> {purchase.contractAddress}</p>
                            <p><strong>Buyer:</strong> {purchase.buyer}</p>
                            <p><strong>Price:</strong> {formatEther(BigInt(purchase.price))}</p>
                            <p><strong>Timestamp:</strong> {new Date(parseInt(purchase.blockTimestamp) * 1000).toLocaleString()}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}