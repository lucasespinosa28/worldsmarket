# Contract Ownership Marketplace
## [Demo website](https://worldsmarket.vercel.app/)
This project implements a marketplace for buying and selling ownership of smart contracts. It consists of a smart contract (`ContractOwnershipMarket`) and a web interface built with Next.js and the Alchemy Account Kit.

## Smart Contract

The `ContractOwnershipMarket` smart contract allows users to list their smart contracts for sale and for others to purchase them. Here are the key features:

1. **Listing a Contract**: Owners can list their contracts for sale by specifying the contract address, the ERC20 token used for payment, and the price.

2. **Activating a Listing**: After listing, the owner must transfer ownership of the contract to the marketplace and then activate the listing.

3. **Purchasing a Contract**: Buyers can purchase listed contracts by paying the specified price in the required token.

4. **Ownership Transfer**: Upon successful purchase, the ownership of the contract is transferred to the buyer.

5. **Listing Management**: Owners can cancel or modify their listings as needed.

## Web Interface

The web interface provides a user-friendly way to interact with the `ContractOwnershipMarket` contract. Key features include:

1. **Listing Contracts**: Users can list their contracts for sale by providing contract details, price, and additional information like name, website, and description.
![worldsmarket vercel app_listing](https://github.com/user-attachments/assets/bf4ec79f-6b7f-40cc-b221-d2a38efcf9da)

2. **Browsing Listings**: Users can view all listed contracts and their details.

3. **Purchasing Contracts**: Users can purchase listed contracts directly through the interface.
![worldsmarket vercel app_exchange_0xe77b8933d5bba5f44e23c6ae91879eb6c2a3017c](https://github.com/user-attachments/assets/282a6f84-83b3-46e9-b46b-58aa3bb07d95)

4. **Account Management**: Utilizes Alchemy's Account Kit for seamless account creation and management.

## How It Works

1. **Listing a Contract**:
   - User fills out the contract listing form with contract details and price.
   - The `listContractOperation` function is called, which:
     a. Lists the contract for sale on the marketplace.
     b. Transfers ownership of the contract to the marketplace.
     c. Activates the listing.
   - Contract details are stored in the database for display on the website.

2. **Purchasing a Contract**:
   - User selects a listed contract to purchase.
   - The `purchaseOperation` function is called, which:
     a. Approves the marketplace to spend the required tokens.
     b. Calls the `purchaseListedContract` function on the marketplace.
   - Upon successful purchase, the contract ownership is transferred to the buyer.

## Technical Implementation

- Smart Contracts: Solidity
- Frontend: Next.js, React
- Backend: Node.js with Prisma ORM
- Blockchain Interaction: viem, wagmi
- Account Management: Alchemy Account Kit

This marketplace provides a secure and efficient way to transfer ownership of smart contracts, opening up new possibilities for contract trading and management in the blockchain ecosystem.
