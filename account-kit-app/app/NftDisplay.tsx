import { Network, Alchemy } from "alchemy-sdk";

// Define types for our NFT data
type NFT = {
  contract: { address: string };
  tokenId: string;
};

type NFTMetadata = {
  title: string;
  tokenType: string;
  tokenUri: { gateway: string };
  rawMetadata: { image: string };
  timeLastUpdated: string;
};

// This is the server-side function that will fetch the NFT data
async function getNFTData(ownerAddr: string) {
  const settings = {
    apiKey: process.env.ALCHEMY_API_KEY,
    network: Network.ETH_MAINNET,
  };
  const alchemy = new Alchemy(settings);

  console.log("fetching NFTs for address:", ownerAddr);

  const nftsForOwner = await alchemy.nft.getNftsForOwner(ownerAddr);
  console.log("number of NFTs found:", nftsForOwner.totalCount);

  const nftList = nftsForOwner.ownedNfts.slice(0, 5); // Limit to first 5 NFTs for this example

  const nftDetails = await Promise.all(
    nftList.map(async (nft) => {
      const metadata = await alchemy.nft.getNftMetadata(
        nft.contract.address,
        nft.tokenId
      );
      return {
        contractAddress: nft.contract.address,
        tokenId: nft.tokenId,
        metadata,
      };
    })
  );

  return nftDetails;
}