"use client";
import { useParams } from 'next/navigation';
import { useSendUserOperation, useSmartAccountClient } from '@account-kit/react';
import { formatEther } from 'viem';
import Button from '@/app/components/Button';
import Alert from '@/app/components/Alert';
import { useState, useEffect } from 'react';
import { purchaseOperation, cancelListingOperation } from '@/app/utils/contractHandlers';
import { useContractListing } from '@/app/hooks/useContractListing';
import ContractOfferForm from '@/app/components/ContractOfferForm';
import ContractOffers from '@/app/components/ContractOffers';
import Image from 'next/image';

interface ContractDetails {
    name: string;
    website: string;
    description: string;
    image: string;
}
export default function ContractDetailPage() {
    const params = useParams();
    const contract = params.id as string;
    const { client } = useSmartAccountClient({ type: "LightAccount" });
    const { listing, loading: listingLoading, error: listingError } = useContractListing(contract);
    const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [contractDetails, setContractDetails] = useState<ContractDetails | null>(null);

    const { sendUserOperation, isSendingUserOperation } = useSendUserOperation({
        client,
        waitForTxn: true,
        onSuccess: ({ hash, request }) => {
            console.log("Transaction sent successfully:", hash, request);
            setAlert({ message: "Transaction sent successfully!", type: 'success' });
        },
        onError: (error) => {
            console.error("Error sending UO:", error);
            setAlert({ message: "Error sending transaction. Please try again.", type: 'error' });
        },
    });

    useEffect(() => {
        const fetchContractDetails = async () => {
            if (listing) {
                try {
                    const response = await fetch(`/api/contracts?address=${listing.contractAddress}`);
                    if (response.ok) {
                        const data = await response.json();
                        setContractDetails(data);
                    } else {
                        console.error('Failed to fetch contract details');
                    }
                } catch (error) {
                    console.error('Error fetching contract details:', error);
                }
            }
        };

        fetchContractDetails();
    }, [listing]);
    if (listingLoading) return <p className="text-center text-gray-600 text-lg font-semibold my-4">Loading...</p>;
    if (listingError) return <p className="text-center text-red-600 text-lg font-semibold my-4">Error: {listingError}</p>;
    if (!listing) return <p className="text-center text-red-600 text-lg font-semibold my-4">Contract listing not found</p>;

    return (
        <div className="container mx-auto px-4 py-8">
            {alert && (
                <Alert
                    message={alert.message}
                    type={alert.type}
                    onClose={() => setAlert(null)}
                />
            )}
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                {contractDetails && (
                    <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/3 mb-4 md:mb-0">
                            <Image
                                src={contractDetails.image}
                                alt={contractDetails.name}
                                width={300}
                                height={300}
                                className="rounded-lg object-cover"
                            />
                        </div>
                        <div className="md:w-2/3 md:pl-6">
                            <p className="mb-2"><strong>Name:</strong> {contractDetails.name}</p>
                            <p className="mb-2"><strong>Website:</strong> <a href={contractDetails.website} target="_blank" rel="noopener noreferrer"
                                className="text-blue-600 hover:underline">{contractDetails.website}</a></p>
                            <p className="mb-2"><strong>Description:</strong> {contractDetails.description}</p>
                            <p className="mb-2"><strong>Contract Address:</strong> {listing.contractAddress}</p>
                            <p className="mb-2"><strong>Owner:</strong> {listing.owner}</p>
                            <p className="mb-2"><strong>Token:</strong> {listing.token}</p>
                            <p className="mb-2"><strong>Price:</strong> {formatEther(BigInt(listing.price))} FC</p>
                            <p className="mb-4"><strong>Listed on:</strong> {new Date(parseInt(listing.blockTimestamp) * 1000).toLocaleString()}</p>
                        </div>
                    </div>
                )}

                <div className="flex space-x-4 mt-4">
                    {client?.account?.address &&
                        <Button
                            color="blue"
                            onClick={() => {
                                if (!client) return;
                                sendUserOperation({
                                    uo: purchaseOperation(listing),
                                })
                            }}
                            disabled={isSendingUserOperation}
                        >
                            {isSendingUserOperation ? "Buying..." : "Buy contract"}
                        </Button>
                    }
                    {client?.account?.address && client.account.address.toLocaleLowerCase() === listing.owner.toLocaleLowerCase() && (
                        <Button
                            color="red"
                            onClick={() => {
                                if (!client) return;
                                sendUserOperation({
                                    uo: cancelListingOperation(listing.contractAddress as `0x${string}`),
                                })
                            }}
                            disabled={isSendingUserOperation || !client}
                        >
                            {isSendingUserOperation ? "Canceling..." : "Cancel listing"}
                        </Button>
                    )}
                </div>
            </div>
            <ContractOfferForm contractAddress={contract as `0x${string}`} />
            <ContractOffers contractAddress={contract as `0x${string}`} owner={listing.owner} />
        </div>
    );
}