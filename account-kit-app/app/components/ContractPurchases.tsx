import { formatEther } from 'viem';
import { useContractPurchases } from '../hooks/useContractPurchases';
import { useSendUserOperation, useSmartAccountClient } from '@account-kit/react';
import Alert from './Alert';
import { useState } from 'react';

export default function ContractPurchases() {
    const { client } = useSmartAccountClient({ type: "LightAccount" });
    const { purchases, loading: purchasesLoading, error: purchasesError } = useContractPurchases();
    const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    

    if (purchasesLoading) return <p className="text-center text-gray-600 text-lg font-semibold my-8 animate-pulse">Loading purchases...</p>;
    if (purchasesError) return <p 
    className="text-center text-red-600 text-lg font-semibold my-8 bg-red-100 p-4 rounded-lg">Error loading purchases: {purchasesError}</p>;

    return (
        <div className="bg-white shadow-lg rounded-xl p-6 mb-8">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">Latest Purchases</h2>
            {alert && (
                <Alert
                    message={alert.message}
                    type={alert.type}
                    onClose={() => setAlert(null)}
                />
            )}
            {purchases && purchases.length > 0 ? (
                <ul className="space-y-6">
                    {purchases.map((purchase, index) => (
                        <li key={index} className="bg-gray-50 rounded-xl p-6 shadow-md transition duration-300 hover:shadow-lg">
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="col-span-2 sm:col-span-1">
                                    <span className="font-semibold text-gray-700">Contract Address:</span>
                                    <span className="ml-2 text-gray-600 bg-gray-200 px-2 py-1 rounded-full text-sm">
                                        {purchase.contractAddress.slice(0, 6)}...{purchase.contractAddress.slice(-4)}
                                    </span>
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <span className="font-semibold text-gray-700">Price:</span>
                                    <span className="ml-2 text-green-600 font-bold">
                                        {formatEther(BigInt(purchase.price))} FC
                                    </span>
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <span className="font-semibold text-gray-700">Time:</span>
                                    <span className="ml-2 text-gray-600">
                                        {new Date(parseInt(purchase.blockTimestamp) * 1000).toLocaleString()}
                                    </span>
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <span className="font-semibold text-gray-700">Buyer:</span>
                                    <span className="ml-2 text-gray-600 bg-gray-200 px-2 py-1 rounded-full text-sm">
                                        {purchase.buyer.slice(0, 6)}...{purchase.buyer.slice(-4)}
                                    </span>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-center text-gray-600 text-lg my-8">No purchases found.</p>
            )}
        </div>
    );
}