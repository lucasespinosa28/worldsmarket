import Link from 'next/link';
import { formatEther } from 'viem';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface ContractCardProps {
    listing: {
        id: string;
        contractAddress: string;
        owner: string;
        token: string;
        price: string;
        blockTimestamp: string;
    };
}

interface ContractDetails {
    name: string;
    website: string;
    description: string;
    image: string;
}

export default function ContractCard({ listing }: ContractCardProps) {
    const [contractDetails, setContractDetails] = useState<ContractDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchContractDetails = async () => {
            try {
                const response = await fetch(`/api/contracts?address=${listing.contractAddress}`);
                if (response.ok) {
                    const data = await response.json();
                    setContractDetails(data);
                } else {
                    console.error('Failed to fetch contract details');
                    setError('Failed to fetch contract details');
                }
            } catch (error) {
                console.error('Error fetching contract details:', error);
                setError('Failed to fetch contract details');
            } finally {
                setIsLoading(false);
            }
        };

        fetchContractDetails();
    }, [listing.contractAddress]);
    if (isLoading) {
        return (
            <div className="block w-full max-w-sm mx-auto p-6 bg-white rounded-lg shadow-md mb-4">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="w-64 h-64 bg-gray-200 rounded-md mb-4"></div>
                    <div className="w-full space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/6"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
           <></>
        );
    }
    return (
        <>
            {contractDetails && (
                <Link href={`/exchange/${listing.contractAddress}`}
                    className="block w-full max-w-sm mx-auto p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 mb-4">
                    <div className="flex flex-col items-center">
                        <h2 className="text-xl font-bold mb-4 text-center">{contractDetails.name}</h2>
                        {contractDetails.image && (
                            <div className="w-64 h-64 relative mb-4">
                                <Image
                                    src={contractDetails.image}
                                    alt={contractDetails.name}
                                    layout="fill"
                                    objectFit="cover"
                                    className="rounded-md"
                                />
                            </div>
                        )}

                        <div className="w-full text-left">
                            <p className="font-semibold">Description: <span className="font-normal">{contractDetails.description}</span></p>
                            <p className="font-semibold">
                                Website: <Link href={contractDetails.website} target="_blank" rel="noopener noreferrer"
                                    className="font-normal underline">{contractDetails.website}</Link>
                            </p>
                            <p className="font-semibold">Price: <span className="font-normal">{formatEther(BigInt(listing.price))} FC</span></p>
                            <p className="font-semibold">Listing date:
                                <span className="font-normal">{new Date(parseInt(listing.blockTimestamp) * 1000).toLocaleString()}</span>
                            </p>
                        </div>
                    </div>
                </Link>
            )}
        </>
    );
}