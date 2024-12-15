export const GET_CONTRACT_LISTINGS = `
  query GetContractListings {
    contractListeds(skip: 0, first: 100) {
      id
      contractAddress
      owner
      token
      price
      blockTimestamp
    }
  }
`;

export const GET_CONTRACT_LISTING = `
  query GetContractListing {
    contractListeds(
    where: {contractAddress: "$address"}
    ) {
      token
      price
      owner
      contractAddress
      blockTimestamp
    }
  }
`;

export const GET_CONTRACT_OFFER = `
  query GetOfferMades {
  offerMades(
    where: {contractAddress: "$address"}
  ) {
    offerer
    offerPrice
    contractAddress
    blockTimestamp
  }
}
`;

export const PURCHASES_QUERY = `
  query GetContractPurchases {
    contractPurchaseds(skip: 0, first: 100) {
      id
      contractAddress
      buyer
      price
      blockTimestamp
    }
  }
`;