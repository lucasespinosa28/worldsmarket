// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract Storage is Ownable {
    uint256 private count;
    constructor(address initialOwner) Ownable(initialOwner) {}

    function setCount() external {
        count++;
    }

    function getCount() external view returns(uint256){
        return count;
    }

    function change(address owner) external{
        Ownable(address(this)).transferOwnership(owner);
    }
}
