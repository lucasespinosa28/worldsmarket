// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.22;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Weapon is ERC721 {
    uint256 private _nextTokenId;

    constructor() ERC721("weapon", "WN") {}

    function _baseURI() internal pure override returns (string memory) {
        return "/api/nft/weapon/";
    }

    function safeMint(address to) external {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
    }
}
