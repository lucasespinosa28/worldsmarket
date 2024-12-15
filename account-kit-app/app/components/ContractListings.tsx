import { useContractListings } from '../hooks/useContractListings';
import { useContractPurchases } from '../hooks/useContractPurchases';
import ContractCard from './ContractCard';

export default function ContractListings({ text = 'Contract Listings' }: { text?: string }) {
    const { listings, loading: listingsLoading, error: listingsError } = useContractListings();
    const { purchases, loading: purchasesLoading, error: purchasesError } = useContractPurchases();

    if (listingsLoading || purchasesLoading) {
        return <p className="text-center text-gray-600 text-lg font-semibold my-4">Loading...</p>;
    }

    if (listingsError || purchasesError) {
        return <p className="text-center text-red-600 text-lg font-semibold my-4">Error: {listingsError || purchasesError}</p>;
    }

    // Filter out listings that have been purchased
    const availableListings = listings.filter(listing => 
        !purchases.some(purchase => purchase.contractAddress === listing.contractAddress)
    );

    return (
        <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mt-8 mb-4">{text}</h2>
            {availableListings.length === 0 ? (
                <p className="text-center text-gray-600 text-lg my-4">No contracts available for sale.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {availableListings.map((listing) => (
                        <ContractCard key={listing.id} listing={listing} />
                    ))}
                </div>
            )}
        </div>
    );
}