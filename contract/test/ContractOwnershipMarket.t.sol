// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "forge-std/Test.sol";
import "../src/ContractOwnershipMarket.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockERC20 is ERC20 {
    constructor() ERC20("MockToken", "MTK") {
        _mint(msg.sender, 1000 ether);
    }
}

contract ContractOwnershipMarketTest is Test {
    ContractOwnershipMarket market;
    MockERC20 token;
    address owner = address(0x1);
    address buyer = address(0x2);
    address offerer = address(0x3);
    address contractAddress = address(0x4);

    function setUp() public {
        token = new MockERC20();
        market = new ContractOwnershipMarket(owner);

        // Transfer some tokens to buyer and offerer
        token.transfer(buyer, 100 ether);
        token.transfer(offerer, 100 ether);

        // Simulate contract ownership
        vm.prank(owner);
        Ownable(contractAddress).transferOwnership(address(market));
    }

    function testListContractForSale() public {
        vm.prank(owner);
        market.listContractForSale(contractAddress, address(token), 10 ether);

        (address listingOwner, address listingToken, uint256 listingPrice) = market.contractListings(contractAddress);
        assertEq(listingOwner, owner);
        assertEq(listingToken, address(token));
        assertEq(listingPrice, 10 ether);
    }

    function testActivateContractListing() public {
        vm.prank(owner);
        market.listContractForSale(contractAddress, address(token), 10 ether);

        vm.prank(owner);
        market.activateContractListing(contractAddress);

        assertTrue(market.isListingActive(contractAddress));
    }

    function testMakeOffer() public {
        vm.prank(owner);
        market.listContractForSale(contractAddress, address(token), 10 ether);

        vm.prank(owner);
        market.activateContractListing(contractAddress);

        vm.prank(offerer);
        market.makeOffer(contractAddress, 8 ether);

        (address offererAddress, uint256 offerPrice) = market.contractOffers(contractAddress);
        assertEq(offererAddress, offerer);
        assertEq(offerPrice, 8 ether);
    }

    function testAcceptOffer() public {
        vm.prank(owner);
        market.listContractForSale(contractAddress, address(token), 10 ether);

        vm.prank(owner);
        market.activateContractListing(contractAddress);

        vm.prank(offerer);
        market.makeOffer(contractAddress, 8 ether);

        vm.prank(offerer);
        token.approve(address(market), 8 ether);

        vm.prank(owner);
        market.acceptOffer(contractAddress);

        assertEq(Ownable(contractAddress).owner(), offerer);
    }

    function testCancelOffer() public {
        vm.prank(owner);
        market.listContractForSale(contractAddress, address(token), 10 ether);

        vm.prank(owner);
        market.activateContractListing(contractAddress);

        vm.prank(offerer);
        market.makeOffer(contractAddress, 8 ether);

        vm.prank(offerer);
        market.cancelOffer(contractAddress);

        (address offererAddress, uint256 offerPrice) = market.contractOffers(contractAddress);
        assertEq(offererAddress, address(0));
        assertEq(offerPrice, 0);
    }
}