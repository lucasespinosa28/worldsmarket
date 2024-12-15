import { ContractListing } from '../types/ContractListing';
import { ContractOffer } from '../types/ContractOffer';
import { GET_CONTRACT_LISTING, GET_CONTRACT_LISTINGS, GET_CONTRACT_OFFER } from './queries';

export async function fetchContractListings(): Promise<ContractListing[]> {
  const response = await fetch(process.env.NEXT_PUBLIC_SUBGRAPH_ONTRACTOWNERSHIPMARKET as string, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: GET_CONTRACT_LISTINGS }),
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const json = await response.json();
  return json.data.contractListeds;
}

export async function fetchContractListing(contractAddress: string): Promise<ContractListing[]> {
  const query = GET_CONTRACT_LISTING.replace('$address', contractAddress);
  console.log(query);
  const response = await fetch(process.env.NEXT_PUBLIC_SUBGRAPH_ONTRACTOWNERSHIPMARKET as string, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: query }),
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const json = await response.json();
  console.log({json})
  return json.data.contractListeds;
}
export async function fetchContractOffers(contractAddress: string): Promise<ContractOffer[]> {
  const query = GET_CONTRACT_OFFER.replace('$address', contractAddress);
  console.log(query);
  const response = await fetch(process.env.NEXT_PUBLIC_SUBGRAPH_ONTRACTOWNERSHIPMARKET as string, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const json = await response.json();
  console.log({json});
  return json.data.offerMades;
}