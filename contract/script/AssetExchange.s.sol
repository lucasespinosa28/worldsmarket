// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {AssetExchange} from "../src/AssetExchange.sol";
contract AssetExchangeScript is Script {
    AssetExchange public assetExchange;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();
        assetExchange = new AssetExchange();
        vm.stopBroadcast();
    }
}
