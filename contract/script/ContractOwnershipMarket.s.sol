// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {ContractOwnershipMarket} from "../src/ContractOwnershipMarket.sol";
contract ContractOwnershipMarketScript is Script {
    ContractOwnershipMarket public contractOwnershipMarket;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();
        contractOwnershipMarket = new ContractOwnershipMarket(msg.sender);
        vm.stopBroadcast();
    }
}
