import Alert from './Alert';
import { useState } from "react";
import { listContractOperation } from "../utils/contractHandlers";
import { useSendUserOperation, useSmartAccountClient } from "@account-kit/react";
import { UploadButton } from '../utils/uploadthing';
import Image from 'next/image'

export default function ContractListingForm() {
    const { client } = useSmartAccountClient({ type: "LightAccount" });
    const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const { sendUserOperation, isSendingUserOperation } = useSendUserOperation({
        client,
        waitForTxn: true,
        onSuccess: ({ hash, request }) => {
            console.log("Transaction sent successfully:", hash, request);
            createContract();
        },
        onError: (error) => {
            console.error("Error sending UO:", error);
            setAlert({ message: "Error listing contract. Please try again.", type: 'error' });
        },
    });

    const [contractAddress, setContractAddress] = useState<`0x${string}`>("0x");
    const [tokenAddress, setTokenAddress] = useState<`0x${string}`>(process.env.NEXT_PUBLIC_FAKECOIN as `0x${string}` || "0x");
    const [price, setPrice] = useState("");
    const [name, setName] = useState("");
    const [website, setWebsite] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!client) return;
        sendUserOperation({ uo: listContractOperation(contractAddress, tokenAddress, price) });
    };

    const createContract = async () => {
        try {
            const response = await fetch('/api/contracts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    address: contractAddress,
                    website,
                    description,
                    image,
                }),
            });

            if (response.ok) {
                setAlert({ message: "Contract listed and created successfully!", type: 'success' });
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create contract');
            }
        } catch (error) {
            console.error("Error creating contract:", error);
            setAlert({ message: "Error creating contract. Please try again.", type: 'error' });
        }
    };
    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">List a New Contract</h2>
            {alert && (
                <Alert
                    message={alert.message}
                    type={alert.type}
                    onClose={() => setAlert(null)}
                />
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <label htmlFor="contractAddress" className="block text-sm font-medium text-gray-700 mb-1">Contract Address</label>
                        <input
                            type="text"
                            id="contractAddress"
                            value={contractAddress}
                            onChange={(e) => setContractAddress(e.target.value as `0x${string}`)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="tokenAddress" className="block text-sm font-medium text-gray-700 mb-1">Token Address</label>
                        <input
                            type="text"
                            id="tokenAddress"
                            value={tokenAddress}
                            disabled={true}
                            onChange={(e) => setTokenAddress(e.target.value as `0x${string}`)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price in fake coin</label>
                    <input
                        type="number"
                        id="price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Contract Name</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                    <input
                        type="url"
                        id="website"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={4}
                    />
                </div>
                <div>
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                    <div className="mt-1 flex items-center justify-between space-x-4">
                        <div className="flex-shrink-0">
                            {image ? (
                                <Image
                                    src={image}
                                    width={256}
                                    height={256}
                                    alt="Uploaded contract image"
                                    className="rounded-lg shadow-md object-cover"
                                />
                            ) : (
                                <div className="w-24 h-24 border-2 border-gray-300 border-dashed rounded-lg 
                                flex items-center justify-center text-gray-400">
                                    No image
                                </div>
                            )}
                        </div>
                        <div className="flex-grow">
                            <UploadButton
                                endpoint="imageUploader"
                                onClientUploadComplete={(res) => {
                                    if (res && res[0]) {
                                        setImage(res[0].url);
                                        setAlert({ message: "Image uploaded successfully!", type: 'success' });
                                    }
                                }}
                                onUploadError={(error: Error) => {
                                    setAlert({ message: `Error uploading image: ${error.message}`, type: 'error' });
                                }}
                            />
                        </div>
                    </div>
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 
                    rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    disabled={isSendingUserOperation}
                >
                    {isSendingUserOperation ? "Listing..." : "List Contract"}
                </button>
            </form>
        </div>
    );
}