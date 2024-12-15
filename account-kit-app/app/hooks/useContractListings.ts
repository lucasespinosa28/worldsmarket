import { useState, useEffect } from 'react';
import { ContractListing } from '../types/ContractListing';
import { fetchContractListings } from '../utils/fetchs';

export function useContractListings() {
    const [listings, setListings] = useState<ContractListing[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await fetchContractListings();
                setListings(data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to fetch listings');
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    return { listings, loading, error };
}