"use client";
import { Network, Alchemy } from "alchemy-sdk";

export async function getNFTData(ownerAddr: string) {
  const settings = {
    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
    network: Network.SHAPE_SEPOLIA,
  };
  const alchemy = new Alchemy(settings);

  console.log("fetching NFTs for address:", ownerAddr);

  const nftsForOwner = await alchemy.nft.getNftsForOwner(ownerAddr);
  console.log({ nft: nftsForOwner.ownedNfts });
  console.log("number of NFTs found:", nftsForOwner.totalCount);

  const nftList = nftsForOwner.ownedNfts; // Limit to first 5 NFTs for this example

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
        balance: nft.balance, // Add balance here
        metadata,
      };
    })
  );

  return nftDetails;
}
