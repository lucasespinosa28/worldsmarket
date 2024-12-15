"use client";
import ContractListings from "@/app/components/ContractListings";
import ContractPurchases from "@/app/components/ContractPurchases";
import Link from "next/link";

export default function Contract() {
    return (
        <div className="container mx-auto px-4 py-8">
            <Link 
                href={`/listing`} 
                className="mb-6 inline-block bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition duration-300 ease-in-out"
            >
                List Contract For Sale
            </Link>
            <Link 
                href={`/latest`} 
                className="mb-6 inline-block ml-4 bg-blue-500
                 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition duration-300 ease-in-out"
            >
               Lastest selled contracts
            </Link>
            <div className="mt-8">
                <ContractListings text="All contract for buy" />
            </div>
        </div>
    );
}