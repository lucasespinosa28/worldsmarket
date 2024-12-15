import { useState, useEffect } from 'react';
import { PURCHASES_QUERY } from '../utils/queries';
import { ContractPurchase } from '../types/ContractPurchase';

export function useContractPurchases() {
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

    return { purchases, loading, error };
}