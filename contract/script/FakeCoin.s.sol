// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {FakeCoin} from "./faucet/FakeCoin.sol";
contract FakeCoinScript is Script {
    FakeCoin public fakecoin;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();
        fakecoin = new FakeCoin();
        vm.stopBroadcast();
    }
}
