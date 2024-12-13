// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/AssetExchange.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockERC721 is ERC721 {
    constructor() ERC721("MockERC721", "MOCK721") {}

    function mint(address to, uint256 tokenId) public {
        _mint(to, tokenId);
    }
}

contract MockERC1155 is ERC1155 {
    constructor() ERC1155("") {}

    function mint(address to, uint256 id, uint256 amount) public {
        _mint(to, id, amount, "");
    }
}

contract MockERC20 is ERC20 {
    constructor() ERC20("MockERC20", "MOCK20") {}

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}

contract AssetExchangeTest is Test {
    AssetExchange public assetExchange;
    MockERC721 public mockERC721;
    MockERC1155 public mockERC1155;
    MockERC20 public mockERC20;

    address public alice = address(0x1);
    address public bob = address(0x2);
    function setUp() public {
        assetExchange = new AssetExchange();
        mockERC721 = new MockERC721();
        mockERC1155 = new MockERC1155();
        mockERC20 = new MockERC20();

        // Mint some tokens to Alice and Bob
        mockERC721.mint(alice, 1);
        mockERC721.mint(bob, 2);
        mockERC1155.mint(alice, 1, 10);
        mockERC1155.mint(bob, 2, 20);
        mockERC20.mint(alice, 1000 ether);
        mockERC20.mint(bob, 1000 ether);

        // Approve AssetExchange to spend tokens
        vm.startPrank(alice);
        mockERC721.approve(address(assetExchange), 1);
        mockERC1155.setApprovalForAll(address(assetExchange), true);
        mockERC20.approve(address(assetExchange), type(uint256).max);
        vm.stopPrank();

        vm.startPrank(bob);
        mockERC721.approve(address(assetExchange), 2);
        mockERC1155.setApprovalForAll(address(assetExchange), true);
        mockERC20.approve(address(assetExchange), type(uint256).max);
        vm.stopPrank();
    }

    function testCreateBox() public {
        vm.startPrank(alice);
        AssetExchange.NFTInfo[] memory nfts = new AssetExchange.NFTInfo[](2);
        nfts[0] = AssetExchange.NFTInfo(address(mockERC721), 1, 1, true);
        nfts[1] = AssetExchange.NFTInfo(address(mockERC1155), 1, 5, false);

        AssetExchange.TokenInfo[] memory tokenInfos = new AssetExchange.TokenInfo[](1);
        tokenInfos[0] = AssetExchange.TokenInfo(address(mockERC20), 100 ether);

        assetExchange.createBox(nfts, tokenInfos);

        assertEq(assetExchange.getBoxCount(), 1);
        (address owner ) = assetExchange.boxes(0);
        assertEq(owner, alice);

        vm.stopPrank();
    }
    function testBuyBox() public {
        // Setup
        vm.startPrank(alice);
        mockERC721.approve(address(assetExchange), 1);

        AssetExchange.NFTInfo[] memory nfts = new AssetExchange.NFTInfo[](1);
        nfts[0] = AssetExchange.NFTInfo(address(mockERC721), 1, 1, true);

        AssetExchange.TokenInfo[] memory tokenInfos = new AssetExchange.TokenInfo[](1);
        tokenInfos[0] = AssetExchange.TokenInfo(address(mockERC20), 100 ether);

        assetExchange.createBox(nfts, tokenInfos);
        vm.stopPrank();

        // Buyer approves token transfer
        vm.startPrank(bob);
        mockERC20.approve(address(assetExchange), 100 ether);

        // Buy the box
        assetExchange.buyBox(0, 0);

        // Assertions
        assertEq(mockERC721.ownerOf(1), bob, "NFT should be transferred to buyer");
        assertEq(mockERC20.balanceOf(alice), 1100 ether, "Seller should receive payment");
        assertEq(assetExchange.getBoxCount(), 0, "Box should be removed after purchase");

        vm.stopPrank();
    }

    function testBuyBoxFailsForNonExistentBox() public {
        vm.startPrank(bob);
        vm.expectRevert("Box does not exist");
        assetExchange.buyBox(999, 0);
        vm.stopPrank();
    }

    function testBuyBoxFailsForInvalidTokenInfoIndex() public {
        // Setup
        vm.startPrank(alice);
        mockERC721.approve(address(assetExchange), 1);

        AssetExchange.NFTInfo[] memory nfts = new AssetExchange.NFTInfo[](1);
        nfts[0] = AssetExchange.NFTInfo(address(mockERC721), 1, 1, true);

        AssetExchange.TokenInfo[] memory tokenInfos = new AssetExchange.TokenInfo[](1);
        tokenInfos[0] = AssetExchange.TokenInfo(address(mockERC721), 100 ether);

        assetExchange.createBox(nfts, tokenInfos);
        vm.stopPrank();

        vm.startPrank(bob);
        vm.expectRevert("Invalid token info index");
        assetExchange.buyBox(0, 999);
        vm.stopPrank();
    }

    function testCreateOffer() public {
        // First, create a box
        testCreateBox();

        vm.startPrank(bob);

        AssetExchange.NFTInfo[] memory nfts = new AssetExchange.NFTInfo[](2);
        nfts[0] = AssetExchange.NFTInfo(address(mockERC721), 2, 1, true);
        nfts[1] = AssetExchange.NFTInfo(address(mockERC1155), 2, 10, false);

        AssetExchange.TokenInfo[] memory tokenInfos = new AssetExchange.TokenInfo[](1);
        tokenInfos[0] = AssetExchange.TokenInfo(address(mockERC20), 50 ether);

        assetExchange.createOffer(0, nfts, tokenInfos);

        assertEq(assetExchange.getOfferCount(), 1);
        (address offerer, uint256 boxId, , ) = assetExchange.getOfferDetails(0);
        assertEq(offerer, bob);
        assertEq(boxId, 0);
        vm.stopPrank();
    }

    function testAcceptOffer() public {
        // First, create a box and an offer
        testCreateOffer();

        vm.startPrank(alice);

        assetExchange.acceptOffer(0);
        assertEq(assetExchange.getBoxCount(), 0);
        assertEq(assetExchange.getOfferCount(), 0);

        // Check that NFTs have been transferred
        assertEq(mockERC721.ownerOf(1), bob);
        assertEq(mockERC721.ownerOf(2), alice);
        assertEq(mockERC1155.balanceOf(alice, 1), 5);
        assertEq(mockERC1155.balanceOf(bob, 1), 5);
        assertEq(mockERC1155.balanceOf(alice, 2), 10);
        assertEq(mockERC1155.balanceOf(bob, 2), 10);

        vm.stopPrank();
    }

    function testCancelOffer() public {
        // First, create a box and an offer
        testCreateOffer();

        vm.startPrank(bob);

        assetExchange.cancelOffer(0);

        assertEq(assetExchange.getOfferCount(), 0);

        // Check that NFTs have been returned
        assertEq(mockERC721.ownerOf(2), bob);
        assertEq(mockERC1155.balanceOf(bob, 2), 20);

        vm.stopPrank();
    }

    function testUpdateOffer() public {
        // First, create a box and an offer
        testCreateOffer();

        vm.startPrank(bob);

        AssetExchange.NFTInfo[] memory newNfts = new AssetExchange.NFTInfo[](1);
        newNfts[0] = AssetExchange.NFTInfo(address(mockERC1155), 2, 15, false);

        AssetExchange.TokenInfo[] memory newTokenInfos = new AssetExchange.TokenInfo[](1);
        newTokenInfos[0] = AssetExchange.TokenInfo(address(mockERC20), 75 ether);

        assetExchange.updateOffer(0, newNfts, newTokenInfos);

        (,, AssetExchange.NFTInfo[] memory updatedNfts, AssetExchange.TokenInfo[] memory updatedTokenInfos) = assetExchange.getOfferDetails(0);

        assertEq(updatedNfts.length, 1);
        assertEq(updatedNfts[0].nftAddress, address(mockERC1155));
        assertEq(updatedNfts[0].tokenId, 2);
        assertEq(updatedNfts[0].amount, 15);
        assertEq(updatedTokenInfos[0].price, 75 ether);

        vm.stopPrank();
    }
}
