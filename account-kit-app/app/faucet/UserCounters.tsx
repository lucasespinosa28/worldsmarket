"use client";
import { useSmartAccountClient } from '@account-kit/react';
import { numberToHex, parseAbi } from 'viem';
import { useState, useEffect } from 'react';

const counter = {
    abi: parseAbi(["function createCounter()", "function getUserCounters(address) view returns (uint256[])"]),
    address: process.env.NEXT_PUBLIC_COUNTERFACTORY as `0x${string}`,
};

interface UserCountersProps {
    address: `0x${string}`;
}

export default function UserCounters({ address }: UserCountersProps) {
    const { client } = useSmartAccountClient({ type: "LightAccount" });
    const [data, setData] = useState<bigint[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        async function fetchCounters() {
            if (!client || !address) return;

            try {
                setIsLoading(true);
                const result = await client.readContract({
                    address: counter.address,
                    abi: counter.abi,
                    functionName: 'getUserCounters',
                    args: [address],
                });
                setData(result as bigint[]);
            } catch (error) {
                console.error("Error fetching counters:", error);
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        }

        fetchCounters();
    }, [client, address]);
    if (!address) return <div>No address provided</div>;
    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error fetching counters</div>;

    return (
        <div>
            <h2 className="text-xl font-bold mb-2">Your Counters</h2>
            {data && data.length > 0 ? (
                <ul>
                    {data.map((counterId, index) => (
                        <li key={index}>Counter ID: {numberToHex(counterId)}</li>
                    ))}
                </ul>
            ) : (
                <p>You dont have any counters yet.</p>
            )}
        </div>
    );
}