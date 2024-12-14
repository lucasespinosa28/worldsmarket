// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IERC1155} from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import {ERC1155Holder} from "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";

contract AssetExchange is ERC1155Holder {
    struct NFTInfo {
        address nftAddress;
        uint256 tokenId;
        uint256 amount;
        bool isERC721;
    }

    struct TokenInfo {
        address token;
        uint256 price;
    }

    struct Box {
        address owner;
        NFTInfo[] nfts;
        TokenInfo[] tokenInfos;
    }

    struct Offer {
        address offerer;
        uint256 boxId;
        NFTInfo[] nfts;
        TokenInfo[] tokenInfos;
    }

    Box[] public boxes;
    Offer[] public offers;

    // Events
    event BoxCreated(uint256 indexed boxId, address indexed owner);
    event BoxBought(uint256 indexed boxId, address indexed buyer, uint256 tokenInfoIndex);
    event OfferCreated(uint256 indexed offerId, uint256 indexed boxId, address indexed offerer);
    event OfferCanceled(uint256 indexed offerId, address indexed offerer);
    event OfferUpdated(uint256 indexed offerId, address indexed offerer);
    event OfferAccepted(uint256 indexed offerId, uint256 indexed boxId, address indexed boxOwner);
    
    function getNFTInfos(
        uint256 _boxId
    ) external view returns (NFTInfo[] memory) {
        require(_boxId < boxes.length, "Box does not exist");
        return boxes[_boxId].nfts;
    }

    function getTokenInfos(
        uint256 _boxId
    ) external view returns (TokenInfo[] memory) {
        require(_boxId < boxes.length, "Box does not exist");
        return boxes[_boxId].tokenInfos;
    }

    function createBox(
        NFTInfo[] memory _nfts,
        TokenInfo[] memory _tokenInfos
    ) external {
        for (uint i = 0; i < _nfts.length; i++) {
            if (_nfts[i].isERC721) {
                IERC721(_nfts[i].nftAddress).transferFrom(
                    msg.sender,
                    address(this),
                    _nfts[i].tokenId
                );
            } else {
                IERC1155(_nfts[i].nftAddress).safeTransferFrom(
                    msg.sender,
                    address(this),
                    _nfts[i].tokenId,
                    _nfts[i].amount,
                    ""
                );
            }
        }
        boxes.push(Box(msg.sender, _nfts, _tokenInfos));
        uint256 newBoxId = boxes.length - 1;
        emit BoxCreated(newBoxId, msg.sender);
    }

    function buyBox(uint256 _boxId, uint256 _tokenInfoIndex) external {
        require(_boxId < boxes.length, "Box does not exist");
        Box storage box = boxes[_boxId];
        require(
            _tokenInfoIndex < box.tokenInfos.length,
            "Invalid token info index"
        );

        for (uint i = 0; i < box.nfts.length; i++) {
            if (box.nfts[i].isERC721) {
                IERC721(box.nfts[i].nftAddress).transferFrom(
                    address(this),
                    msg.sender,
                    box.nfts[i].tokenId
                );
            } else {
                IERC1155(box.nfts[i].nftAddress).safeTransferFrom(
                    address(this),
                    msg.sender,
                    box.nfts[i].tokenId,
                    box.nfts[i].amount,
                    ""
                );
            }
        }

        TokenInfo memory selectedToken = box.tokenInfos[_tokenInfoIndex];
        IERC20(selectedToken.token).transferFrom(
            msg.sender,
            box.owner,
            selectedToken.price
        );
        // Remove the box from the array
        if (_boxId < boxes.length - 1) {
            boxes[_boxId] = boxes[boxes.length - 1];
        }
        boxes.pop();
        emit BoxBought(_boxId, msg.sender, _tokenInfoIndex);
    }

    function getBoxCount() external view returns (uint256) {
        return boxes.length;
    }

    function cancelOffer(uint256 _offerId) external {
        require(_offerId < offers.length, "Offer does not exist");
        Offer storage offer = offers[_offerId];
        require(
            msg.sender == offer.offerer,
            "Only offerer can cancel the offer"
        );

        // Return NFTs to the offerer
        for (uint i = 0; i < offer.nfts.length; i++) {
            if (offer.nfts[i].isERC721) {
                IERC721(offer.nfts[i].nftAddress).transferFrom(
                    address(this),
                    msg.sender,
                    offer.nfts[i].tokenId
                );
            } else {
                IERC1155(offer.nfts[i].nftAddress).safeTransferFrom(
                    address(this),
                    msg.sender,
                    offer.nfts[i].tokenId,
                    offer.nfts[i].amount,
                    ""
                );
            }
        }

        // Remove the offer
        if (_offerId < offers.length - 1) {
            offers[_offerId] = offers[offers.length - 1];
        }
        offers.pop();
        emit OfferCanceled(_offerId, msg.sender);
    }

    function updateOffer(
        uint256 _offerId,
        NFTInfo[] memory _newNfts,
        TokenInfo[] memory _newTokenInfos
    ) external {
        require(_offerId < offers.length, "Offer does not exist");
        Offer storage offer = offers[_offerId];
        require(
            msg.sender == offer.offerer,
            "Only offerer can update the offer"
        );

        // Return old NFTs to the offerer
        for (uint i = 0; i < offer.nfts.length; i++) {
            if (offer.nfts[i].isERC721) {
                IERC721(offer.nfts[i].nftAddress).transferFrom(
                    address(this),
                    msg.sender,
                    offer.nfts[i].tokenId
                );
            } else {
                IERC1155(offer.nfts[i].nftAddress).safeTransferFrom(
                    address(this),
                    msg.sender,
                    offer.nfts[i].tokenId,
                    offer.nfts[i].amount,
                    ""
                );
            }
        }

        // Transfer new NFTs to the contract
        for (uint i = 0; i < _newNfts.length; i++) {
            if (_newNfts[i].isERC721) {
                IERC721(_newNfts[i].nftAddress).transferFrom(
                    msg.sender,
                    address(this),
                    _newNfts[i].tokenId
                );
            } else {
                IERC1155(_newNfts[i].nftAddress).safeTransferFrom(
                    msg.sender,
                    address(this),
                    _newNfts[i].tokenId,
                    _newNfts[i].amount,
                    ""
                );
            }
        }

        // Update the offer
        offer.nfts = _newNfts;
        offer.tokenInfos = _newTokenInfos;
        emit OfferUpdated(_offerId, msg.sender);
    }

    function createOffer(
        uint256 _boxId,
        NFTInfo[] memory _nfts,
        TokenInfo[] memory _tokenInfos
    ) external {
        require(_boxId < boxes.length, "Box does not exist");

        for (uint i = 0; i < _nfts.length; i++) {
            if (_nfts[i].isERC721) {
                IERC721(_nfts[i].nftAddress).transferFrom(
                    msg.sender,
                    address(this),
                    _nfts[i].tokenId
                );
            } else {
                IERC1155(_nfts[i].nftAddress).safeTransferFrom(
                    msg.sender,
                    address(this),
                    _nfts[i].tokenId,
                    _nfts[i].amount,
                    ""
                );
            }
        }

        offers.push(Offer(msg.sender, _boxId, _nfts, _tokenInfos));
        uint256 newOfferId = offers.length - 1;
        emit OfferCreated(newOfferId, _boxId, msg.sender);
    }

    function acceptOffer(uint256 _offerId) external {
        require(_offerId < offers.length, "Offer does not exist");
        Offer storage offer = offers[_offerId];
        require(
            msg.sender == boxes[offer.boxId].owner,
            "Only box owner can accept offer"
        );

        // Transfer NFTs from the offer to the box owner
        for (uint i = 0; i < offer.nfts.length; i++) {
            if (offer.nfts[i].isERC721) {
                IERC721(offer.nfts[i].nftAddress).transferFrom(
                    address(this),
                    msg.sender,
                    offer.nfts[i].tokenId
                );
            } else {
                IERC1155(offer.nfts[i].nftAddress).safeTransferFrom(
                    address(this),
                    msg.sender,
                    offer.nfts[i].tokenId,
                    offer.nfts[i].amount,
                    ""
                );
            }
        }

        // Transfer NFTs from the box to the offerer
        Box storage box = boxes[offer.boxId];
        for (uint i = 0; i < box.nfts.length; i++) {
            if (box.nfts[i].isERC721) {
                IERC721(box.nfts[i].nftAddress).transferFrom(
                    address(this),
                    offer.offerer,
                    box.nfts[i].tokenId
                );
            } else {
                IERC1155(box.nfts[i].nftAddress).safeTransferFrom(
                    address(this),
                    offer.offerer,
                    box.nfts[i].tokenId,
                    box.nfts[i].amount,
                    ""
                );
            }
        }

        // Remove the offer and the box
        if (_offerId < offers.length - 1) {
            offers[_offerId] = offers[offers.length - 1];
        }
        offers.pop();

        uint256 boxId = offer.boxId;
        if (boxId < boxes.length - 1) {
            boxes[boxId] = boxes[boxes.length - 1];
        }
        boxes.pop();
        emit OfferAccepted(_offerId, offer.boxId, msg.sender);
    }

    function getOfferCount() external view returns (uint256) {
        return offers.length;
    }

    function getOfferDetails(
        uint256 _offerId
    )
        external
        view
        returns (address, uint256, NFTInfo[] memory, TokenInfo[] memory)
    {
        require(_offerId < offers.length, "Offer does not exist");
        Offer storage offer = offers[_offerId];
        return (offer.offerer, offer.boxId, offer.nfts, offer.tokenInfos);
    }
}
