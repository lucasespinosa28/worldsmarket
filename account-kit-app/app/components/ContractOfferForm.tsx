"use client";
import { useState } from "react";
import { useSendUserOperation, useSmartAccountClient } from "@account-kit/react";
import Alert from './Alert';
import { makeOfferOperation } from "../utils/contractHandlers";

interface ContractOfferFormProps {
    contractAddress: `0x${string}`;
}

export default function ContractOfferForm({ contractAddress }: ContractOfferFormProps) {
    const { client } = useSmartAccountClient({ type: "LightAccount" });
    const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const { sendUserOperation, isSendingUserOperation } = useSendUserOperation({
        client,
        waitForTxn: true,
        onSuccess: ({ hash, request }) => {
            console.log("Offer sent successfully:", hash, request);
            setAlert({ message: "Offer made successfully!", type: 'success' });
        },
        onError: (error) => {
            console.error("Error sending UO:", error);
            setAlert({ message: "Error making offer. Please try again.", type: 'error' });
        },
    });

    const [offerPrice, setOfferPrice] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!client) return;
        sendUserOperation({ uo: makeOfferOperation(contractAddress, offerPrice) });
    };

    return (
        <div className=" mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Make an Offer</h2>
            {alert && (
                <Alert
                    message={alert.message}
                    type={alert.type}
                    onClose={() => setAlert(null)}
                />
            )}
             {client?.account?.address &&
             <form onSubmit={handleSubmit} className="space-y-4">
             <div>
                 <label htmlFor="offerPrice" className="block text-sm font-medium text-gray-700 mb-1">
                     Offer Price (FC)
                 </label>
                 <div className="mt-1 relative rounded-md shadow-sm">
                     <input
                         type="number"
                         id="offerPrice"
                         value={offerPrice}
                         onChange={(e) => setOfferPrice(e.target.value)}
                         className="block max-w  P-2 sm:text-sm border-gray-300 rounded-md
                             focus:ring-indigo-500 focus:border-indigo-500"
                         placeholder="0.00"
                         step="0.01"
                         min="0"
                         required
                     />
                 </div>
             </div>
             <button
                 type="submit"
                 className="max-w-md flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium
                  text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                  focus:ring-indigo-500 transition duration-150 ease-in-out"
                 disabled={isSendingUserOperation}
             >
                 {isSendingUserOperation ? (
                     <>
                         <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                         xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                             <path className="opacity-75" fill="currentColor" 
                             d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">

                             </path>
                         </svg>
                         Making Offer...
                     </>
                 ) : (
                     "Make Offer"
                 )}
             </button>
         </form>
             }
            
        </div>
    );
}