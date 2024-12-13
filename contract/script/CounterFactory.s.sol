// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {CounterFactory} from "../src/CounterFactory.sol";
contract CounterFactoryScript is Script {
    CounterFactory public counterFactory;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();
        counterFactory = new CounterFactory();
        vm.stopBroadcast();
    }
}
