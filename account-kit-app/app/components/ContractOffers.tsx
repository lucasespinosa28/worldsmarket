import { formatEther } from 'viem';
import { useContractOffers } from '../hooks/useContractOffers';
import { useSendUserOperation, useSmartAccountClient } from '@account-kit/react';
import { acceptOfferOperation, cancelOfferOperation } from '../utils/contractHandlers';
import Button from './Button';
import Alert from './Alert';
import { useState } from 'react';

interface ContractOffers {
    contractAddress: `0x${string}`;
    owner: string;
}

export default function ContractOffers({ contractAddress, owner }: ContractOffers) {
    const { client } = useSmartAccountClient({ type: "LightAccount" });
    const { offers, loading: offersLoading, error: offersError } = useContractOffers(contractAddress);
    const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
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

    if (offersLoading) return <p className="text-center text-gray-600 text-lg font-semibold my-8 animate-pulse">Loading offers...</p>;
    if (offersError) return <p className="text-center text-red-600 text-lg font-semibold my-8
     bg-red-100 p-4 rounded-lg">Error loading offers: {offersError}</p>;
    return (
        <div className="bg-white shadow-lg rounded-xl p-6 mb-8">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">Contract Offers</h2>
            {alert && (
                <Alert
                    message={alert.message}
                    type={alert.type}
                    onClose={() => setAlert(null)}
                />
            )}
            {offers && offers.length > 0 ? (
                <ul className="space-y-6">
                    {offers.map((offer, index) => (
                        <li key={index} className="bg-gray-50 rounded-xl p-6 shadow-md transition duration-300 hover:shadow-lg">
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="col-span-2 sm:col-span-1">
                                    <span className="font-semibold text-gray-700">Offerer:</span>
                                    <span className="ml-2 text-gray-600 bg-gray-200 px-2 py-1 rounded-full text-sm">
                                        {offer.offerer.slice(0, 6)}...{offer.offerer.slice(-4)}
                                    </span>
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <span className="font-semibold text-gray-700">Price:</span>
                                    <span className="ml-2 text-green-600 font-bold">
                                        {formatEther(BigInt(offer.offerPrice))} FC
                                    </span>
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <span className="font-semibold text-gray-700">Time:</span>
                                    <span className="ml-2 text-gray-600">
                                        {new Date(parseInt(offer.blockTimestamp) * 1000).toLocaleString()}
                                    </span>
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <span className="font-semibold text-gray-700">Owner:</span>
                                    <span className="ml-2 text-gray-600 bg-gray-200 px-2 py-1 rounded-full text-sm">
                                        {owner.slice(0, 6)}...{owner.slice(-4)}
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-wrap justify-end space-x-2 mt-4">
                                {client?.account?.address && client.account.address.toLowerCase() === owner.toLowerCase() && (
                                    <Button
                                        color="blue"
                                        onClick={() => {
                                            if (!client) return;
                                            sendUserOperation({
                                                uo: acceptOfferOperation(contractAddress as `0x${string}`),
                                            })
                                        }}
                                        disabled={isSendingUserOperation || !client}
                                    >
                                        {isSendingUserOperation ? "Accepting..." : "Accept Offer"}
                                    </Button>
                                )}
                                {client?.account?.address && client.account.address.toLowerCase() === offer.offerer.toLowerCase() && (
                                    <Button
                                        color="red"
                                        onClick={() => {
                                            if (!client) return;
                                            sendUserOperation({
                                                uo: cancelOfferOperation(contractAddress as `0x${string}`),
                                            })
                                        }}
                                        disabled={isSendingUserOperation || !client}
                                    >
                                        {isSendingUserOperation ? "Canceling..." : "Cancel Offer"}
                                    </Button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-center text-gray-600 py-8 bg-gray-100 rounded-lg text-lg">No offers available at the moment.</p>
            )}
        </div>
    );
}