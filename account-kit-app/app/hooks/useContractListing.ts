import { useState, useEffect } from 'react';
import { ContractListing } from '../types/ContractListing';
import { fetchContractListing } from '../utils/fetchs';

export function useContractListing(contractAddress: string) {
    const [listing, setListing] = useState<ContractListing | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            if (!contractAddress) {
                setError('Contract address is required');
                setLoading(false);
                return;
            }
            try {
                const data = await fetchContractListing(contractAddress);
                setListing(data[0]);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to fetch listing');
                setLoading(false);
            }
        }

        fetchData();
    }, [contractAddress]);

    return { listing, loading, error };
}