'use client';
import SearchBar from "@/components/navbar/SearchBar";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from 'next/link';
import { useAccount } from "wagmi";

export default function Page() {
  const { address } = useAccount()
  return (
    <nav className="flex justify-between items-center py-4 px-8 bg-background text-foreground">
      <div className="flex items-center space-x-4">
        <Link href="/" className="text-xl font-bold">WorldsMarket</Link>
        <Link href="/collections" className="hover:text-gray-300">Collections</Link>
        {address && <Link href={`/profile/${address}`} className="hover:text-gray-300">Profile</Link>}
        <Link href="/sell" className="hover:text-gray-300">Sell</Link>
      </div>
      <SearchBar />
      <ConnectButton />
    </nav>
  );
}
