"use client";
import { AuthButton } from '../components/AuthButton';
import Link from 'next/link';
import ContractListings from './components/ContractListings';

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-center">Smart Contract Marketplace</h1>

      <section className="mb-12 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">About Our Platform</h2>
        <p className="text-lg mb-4 text-gray-700 leading-relaxed">
          Welcome to our decentralized marketplace for smart contracts. Here, developers can monetize their creations, 
          while businesses can acquire powerful blockchain solutions. Our platform ensures secure and efficient 
          transactions in the world of smart contracts.
        </p>
        <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 rounded">
          <h3 className="font-bold mb-2">Earn from Your Contracts</h3>
          <p className="text-sm">
            On the Shape Network, contract owners receive 80% of transaction fees. Owning popular contracts 
            can lead to significant passive income through usage fees.
          </p>
        </div>
      </section>

      <section className="mb-12 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
        <ul className="list-disc list-inside text-lg mb-6 text-gray-700">
          <li>List and sell your smart contracts</li>
          <li>Browse and purchase contracts</li>
          <li>Secure ownership transfer</li>
          <li>Easy authentication with Account Kit</li>
        </ul>
        
      </section>

      <section className="mb-12 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Get Started</h2>
        <p className="text-lg mb-4 text-gray-700">
          To begin buying or selling smart contracts, please log in or create an account:
        </p>
        <div className="flex justify-center">
          <AuthButton />
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-center">Featured Contracts</h2>
        <ContractListings />
      </section>

      <section className="flex justify-center gap-6">
        <Link href="/exchange" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300">
          Browse All Contracts
        </Link>
        <Link href="/faucet" className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition duration-300">
          Get Test Tokens
        </Link>
      </section>
    </main>
  );
}
