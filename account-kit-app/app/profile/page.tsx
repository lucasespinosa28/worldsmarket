"use client";
import { useSmartAccountClient } from "@account-kit/react";
import { Alchemy, Network } from "alchemy-sdk";
import { useState, useEffect } from "react";

async function getNFTData(ownerAddr: string) {
  const settings = {
    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
    network: Network.SHAPE_SEPOLIA,
  };
  const alchemy = new Alchemy(settings);

  console.log("fetching NFTs for address:", ownerAddr);

  const nftsForOwner = await alchemy.nft.getNftsForOwner(ownerAddr);
  console.log({nft:nftsForOwner.ownedNfts});
  console.log("number of NFTs found:", nftsForOwner.totalCount);

  const nftList = nftsForOwner.ownedNfts // Limit to first 5 NFTs for this example

  const nftDetails = await Promise.all(
    nftList.map(async (nft) => {
      const metadata = await alchemy.nft.getNftMetadata(
        nft.contract.address,
        nft.tokenId
      );
      return {
        contractAddress: nft.contract.address,
        tokenId: nft.tokenId,
        tokenType: nft.tokenType, // Add tokenType here
        metadata,
      };
    })
  );

  return nftDetails;
}

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