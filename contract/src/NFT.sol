// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.22;

import {ERC721} from "solmate/tokens/ERC721.sol";

contract NFT is ERC721 {
     constructor(
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) {}

    function _baseURI() internal pure returns (string memory) {
        return "http://localhost:3000/api/mock/gun/";
    }
}