// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "forge-std/Test.sol";
import "../src/ContractOwnershipMarket.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockERC20 is ERC20 {
    constructor() ERC20("MockToken", "MTK") {}

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}

contract MockOwnable is Ownable {
    constructor(address initialOwner) Ownable(initialOwner) {}
}

contract ContractOwnershipMarketTest is Test {
    ContractOwnershipMarket market;
    MockERC20 token;
    MockOwnable ownableContract;
    address owner = address(1);
    address buyer = address(2);

    function setUp() public {
        vm.startPrank(owner);
        market = new ContractOwnershipMarket(owner);
        token = new MockERC20();
        ownableContract = new MockOwnable(owner);
        vm.stopPrank();

        vm.startPrank(buyer);
        token.approve(address(market), type(uint256).max);
        token.mint(buyer, 100 ether);
        vm.stopPrank();
    }

    function testListContractForSale() public {
        vm.startPrank(owner);
        market.listContractForSale(
            address(ownableContract),
            address(token),
            100 ether
        );

        (address listedOwner, address listedToken, uint256 listedPrice) = market
            .contractListings(address(ownableContract));
        assertEq(listedOwner, owner);
        assertEq(listedToken, address(token));
        assertEq(listedPrice, 100 ether);
        assertEq(market.isListingActive(address(ownableContract)), false);
        vm.stopPrank();
    }

    function testActivateContractListing() public {
        vm.startPrank(owner);
        market.listContractForSale(
            address(ownableContract),
            address(token),
            100 ether
        );
        ownableContract.transferOwnership(address(market));
        market.activateContractListing(address(ownableContract));

        assertTrue(market.isListingActive(address(ownableContract)));
        vm.stopPrank();
    }

    function testCancelContractListing() public {
        vm.startPrank(owner);
        market.listContractForSale(
            address(ownableContract),
            address(token),
            100 ether
        );
        ownableContract.transferOwnership(address(market));
        market.cancelContractListing(address(ownableContract));

        (address listedOwner, , ) = market.contractListings(
            address(ownableContract)
        );
        assertEq(listedOwner, address(0));
        assertEq(market.isListingActive(address(ownableContract)), false);
        assertEq(ownableContract.owner(), owner);
        vm.stopPrank();
    }

    function testPurchaseListedContract() public {
        vm.startPrank(owner);
        market.listContractForSale(
            address(ownableContract),
            address(token),
            100 ether
        );
        ownableContract.transferOwnership(address(market));
        market.activateContractListing(address(ownableContract));
        vm.stopPrank();

        vm.startPrank(buyer);
        token.approve(address(market), 100 ether);
        market.purchaseListedContract(address(ownableContract));

        assertEq(ownableContract.owner(), buyer);
        assertEq(token.balanceOf(owner), 100 ether);
        vm.stopPrank();
    }

    function testFailListContractNotOwner() public {
        vm.prank(buyer);
        market.listContractForSale(
            address(ownableContract),
            address(token),
            100
        );
    }

    function testMakeOffer() public {
        vm.startPrank(owner);
        market.listContractForSale(address(ownableContract), address(token), 100 * 10**18);
        market.activateContractListing(address(ownableContract));
        vm.stopPrank();

        vm.startPrank(buyer);
        market.makeOffer(address(ownableContract), 90 * 10**18);
        (address buyerAddress, uint256 offerPrice) = market.contractOffers(address(ownableContract));
        assertEq(buyerAddress, buyer);
        assertEq(offerPrice, 90 * 10**18);
        vm.stopPrank();
    }

    function testAcceptOffer() public {
        vm.startPrank(owner);
        market.listContractForSale(address(ownableContract), address(token), 100 * 10**18);
        market.activateContractListing(address(ownableContract));
        vm.stopPrank();

        vm.startPrank(buyer);
        token.approve(address(market), 90 * 10**18);
        market.makeOffer(address(ownableContract), 90 * 10**18);
        vm.stopPrank();

        vm.startPrank(owner);
        market.acceptOffer(address(ownableContract));
        (address listingOwner,,) = market.contractListings(address(ownableContract));
        assertEq(listingOwner, address(0));
        assertFalse(market.isListingActive(address(ownableContract)));
        vm.stopPrank();
    }

    function testCancelOffer() public {
        vm.startPrank(owner);
        market.listContractForSale(address(ownableContract), address(token), 100 * 10**18);
        market.activateContractListing(address(ownableContract));
        vm.stopPrank();

        vm.startPrank(buyer);
        market.makeOffer(address(ownableContract), 90 * 10**18);
        market.cancelOffer(address(ownableContract));
        (address buyerAddress,) = market.contractOffers(address(ownableContract));
        assertEq(buyerAddress, address(0));
        vm.stopPrank();
    }

    function testFailActivateContractNotOwner() public {
        vm.prank(owner);
        market.listContractForSale(
            address(ownableContract),
            address(token),
            100
        );

        vm.prank(buyer);
        market.activateContractListing(address(ownableContract));
    }

    function testFailCancelContractNotOwner() public {
        vm.prank(owner);
        market.listContractForSale(
            address(ownableContract),
            address(token),
            100
        );

        vm.prank(buyer);
        market.cancelContractListing(address(ownableContract));
    }

    function testFailPurchaseInactiveContract() public {
        vm.prank(owner);
        market.listContractForSale(
            address(ownableContract),
            address(token),
            100
        );

        vm.prank(buyer);
        market.purchaseListedContract(address(ownableContract));
    }
}
