"use client";
import { useSmartAccountClient } from "@account-kit/react";
import { useState, useEffect } from "react";
import { getNFTData } from "./getNFTData";

export default function Page() {
  const { client } = useSmartAccountClient({ type: "LightAccount" });
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNFTs() {
      if (client) {
        try {
          const address = await client.getAddress();
          const nftData = await getNFTData(address);
          setNfts(nftData);
        } catch (error) {
          console.error("Error fetching NFTs:", error);
        } finally {
          setLoading(false);
        }
      }
    }

    fetchNFTs();
  }, [client]);

  if (loading) {
    return <h1>Loading NFTs...</h1>;
  }

  return (
    <div>
      <h1>Profile</h1>
      <h2>Your NFTs:</h2>
      {nfts.length === 0 ? (
        <p>No NFTs found.</p>
      ) : (
        <ul>
          {nfts.map((nft, index) => (
            <li key={index}>
              <p>Contract Address: {nft.contractAddress}</p>
              <p>Token ID: {nft.tokenId}</p>
              <p>Token Type: {nft.tokenType}</p> {/* Add this line to display tokenType */}
              <p>Title: {nft.metadata.title}</p>
              {nft.metadata.rawMetadata?.image && (
                <img 
                  src={nft.metadata.rawMetadata.image} 
                  alt={nft.metadata.title || "NFT"} 
                  style={{ maxWidth: "200px" }}
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}