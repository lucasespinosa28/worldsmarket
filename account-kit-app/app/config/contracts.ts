import { parseAbi } from "viem/utils";

export const contractToSell = {
    abi: parseAbi(["function transferOwnership(address)"]),
    address: process.env.NEXT_PUBLIC_COUNTERFACTORY as `0x${string}`,
};

export const ContractOwnershipMarket = {
    abi: parseAbi([
        "function listContractForSale(address,address,uint256)",
        "function activateContractListing(address)",
        "function purchaseListedContract(address)",
        "function cancelContractListing(address)",
        "function makeOffer(address _contract, uint256 _offerPrice)",
        "function acceptOffer(address _contract)",
        "function cancelOffer(address _contract)"
    ]),
    address: process.env.NEXT_PUBLIC_CONTRACTOWNERSHIPMARKET as `0x${string}`,
};