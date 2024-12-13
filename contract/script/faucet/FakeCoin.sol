// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.22;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
contract FakeCoin is ERC20 {
    constructor() ERC20("FakceCoin", "FC") {}

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}