import { useState, useEffect } from 'react';
import { ContractOffer } from '../types/ContractOffer';
import { fetchContractOffers } from '../utils/fetchs';

export function useContractOffers(contractAddress: string) {
    const [offers, setOffers] = useState<ContractOffer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await fetchContractOffers(contractAddress);
                console.log({data});
                setOffers(data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to fetch listings');
                setLoading(false);
            }
        }

        fetchData();
    }, [contractAddress]);

    return { offers, loading, error };
}