// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import {Counter} from "./Counter.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
contract CounterFactory {
    mapping(address => address[]) public creations;
    function createCounter() external returns (address) {
        Counter counter = new Counter(msg.sender);
        creations[msg.sender].push(address(counter));
        return address(counter);
    }

    function getUserCounters(
        address user
    ) external view returns (address[] memory) {
        return creations[user];
    }
}
