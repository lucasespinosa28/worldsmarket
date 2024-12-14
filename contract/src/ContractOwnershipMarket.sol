// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ContractOwnershipMarket is Ownable {
    struct Listing {
        address owner;
        address token;
        uint256 price;
    }

    struct Offer {
        address offerer;
        uint256 offerPrice;
    }
    uint256 public count = 0;
    mapping(address => Listing) public contractListings;
    mapping(address => bool) public isListingActive;
    mapping(address => Offer) public contractOffers;

    // Events
    event ContractListed(
        address indexed contractAddress,
        address indexed owner,
        address token,
        uint256 price
    );
    event ListingActivated(address indexed contractAddress);
    event ListingCanceled(address indexed contractAddress);
    event ContractPurchased(
        address indexed contractAddress,
        address indexed buyer,
        uint256 price
    );
    event OfferMade(
        address indexed contractAddress,
        address indexed offerer,
        uint256 offerPrice
    );
    event OfferAccepted(
        address indexed contractAddress,
        address indexed offerer,
        uint256 offerPrice
    );
    event OfferCanceled(address indexed contractAddress, address indexed offerer);
    constructor(address initialOwner) Ownable(initialOwner) {}

    function listContractForSale(
        address _contract,
        address _token,
        uint256 _price
    ) external {
        require(
            Ownable(_contract).owner() == msg.sender,
            "Only the contract owner can list it for sale"
        );

        contractListings[_contract] = Listing(msg.sender, _token, _price);
        isListingActive[_contract] = false;
        emit ContractListed(_contract, msg.sender, _token, _price);
    }

    function activateContractListing(address _contract) external {
        require(
            contractListings[_contract].owner == msg.sender,
            "Only the listing owner can activate the listing"
        );

        require(
            Ownable(_contract).owner() == address(this),
            "Contract ownership must be transferred to this market before activation"
        );

        isListingActive[_contract] = true;
        emit ListingActivated(_contract);
    }

    function cancelContractListing(address _contract) external {
        require(
            contractListings[_contract].owner == msg.sender,
            "Not the listing owner"
        );

        require(
            Ownable(_contract).owner() == address(this),
            "Contract ownership not transferred to market"
        );

        // Transfer ownership back to the listing owner
        Ownable(_contract).transferOwnership(msg.sender);

        // Remove the listing
        delete contractListings[_contract];
        delete isListingActive[_contract];
        emit ListingCanceled(_contract);
    }

    function purchaseListedContract(address _contract) external {
        require(isListingActive[_contract], "Contract listing is not active");

        Listing memory info = contractListings[_contract];

        require(
            IERC20(info.token).transferFrom(msg.sender, info.owner, info.price),
            "Token transfer failed"
        );

        Ownable(_contract).transferOwnership(msg.sender);

        // Clean up the listing
        delete contractListings[_contract];
        delete isListingActive[_contract];
        emit ContractPurchased(_contract, msg.sender, info.price);
    }

    function makeOffer(address _contract, uint256 _offerPrice) external {
        require(isListingActive[_contract], "Contract listing is not active");

        contractOffers[_contract] = Offer(msg.sender, _offerPrice);
        emit OfferMade(_contract, msg.sender, _offerPrice);
    }

    function acceptOffer(address _contract) external {
        require(
            contractListings[_contract].owner == msg.sender,
            "Only the listing owner can accept an offer"
        );

        Offer memory offer = contractOffers[_contract];
        require(offer.offerer != address(0), "No offer to accept");

        require(
            IERC20(contractListings[_contract].token).transferFrom(offer.offerer, msg.sender, offer.offerPrice),
            "Token transfer failed"
        );

        Ownable(_contract).transferOwnership(offer.offerer);

        // Clean up the listing and offer
        delete contractListings[_contract];
        delete isListingActive[_contract];
        delete contractOffers[_contract];
        emit OfferAccepted(_contract, offer.offerer, offer.offerPrice);
    }

    function cancelOffer(address _contract) external {
        Offer memory offer = contractOffers[_contract];
        require(offer.offerer == msg.sender, "Only the offerer can cancel the offer");

        delete contractOffers[_contract];
        emit OfferCanceled(_contract, msg.sender);
    }
}
