import { encodeFunctionData, parseAbi, parseEther } from 'viem';
import { ContractListing } from '../types/ContractListing';
import { ContractOwnershipMarket, contractToSell } from '../config/contracts';

export const erc20 = {
  abi: parseAbi(["function approve(address, uint256)"]),
};

export function listContractOperation(contractAddress: `0x${string}`, tokenAddress: `0x${string}`, price: string) {
  return [
    {
      target: ContractOwnershipMarket.address,
      data: encodeFunctionData({
        abi: ContractOwnershipMarket.abi,
        functionName: "listContractForSale",
        args: [contractAddress, tokenAddress, parseEther(price)],
      }),
    },
    {
      target: contractAddress,
      data: encodeFunctionData({
        abi: contractToSell.abi,
        functionName: "transferOwnership",
        args: [ContractOwnershipMarket.address],
      }),
    },
    {
      target: ContractOwnershipMarket.address,
      data: encodeFunctionData({
        abi: ContractOwnershipMarket.abi,
        functionName: "activateContractListing",
        args: [contractAddress],
      }),
    },
  ];
}

export function purchaseOperation(listing: ContractListing) {
  return [
    {
      target: listing.token as `0x${string}`,
      data: encodeFunctionData({
        abi: erc20.abi,
        functionName: "approve",
        args: [ContractOwnershipMarket.address, BigInt(listing.price)],
      }),
    },
    {
      target: ContractOwnershipMarket.address,
      data: encodeFunctionData({
        abi: ContractOwnershipMarket.abi,
        functionName: "purchaseListedContract",
        args: [listing.contractAddress as `0x${string}`],
      }),
    },
  ];
}

export function cancelListingOperation(contractAddress: `0x${string}`) {
  return [
    {
      target: ContractOwnershipMarket.address,
      data: encodeFunctionData({
        abi: ContractOwnershipMarket.abi,
        functionName: "cancelContractListing",
        args: [contractAddress],
      }),
    },
  ];
}

export function makeOfferOperation(contractAddress: `0x${string}`, offerPrice: string) {
  return [
    {
      target: ContractOwnershipMarket.address,
      data: encodeFunctionData({
        abi: ContractOwnershipMarket.abi,
        functionName: "makeOffer",
        args: [contractAddress, parseEther(offerPrice)],
      }),
    },
  ];
}

export function acceptOfferOperation(contractAddress: `0x${string}`) {
  return [
    {
      target: ContractOwnershipMarket.address,
      data: encodeFunctionData({
        abi: ContractOwnershipMarket.abi,
        functionName: "acceptOffer",
        args: [contractAddress],
      }),
    },
  ];
}

export function cancelOfferOperation(contractAddress: `0x${string}`) {
  return [
    {
      target: ContractOwnershipMarket.address,
      data: encodeFunctionData({
        abi: ContractOwnershipMarket.abi,
        functionName: "cancelOffer",
        args: [contractAddress],
      }),
    },
  ];
}
