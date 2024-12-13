// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {Potion} from "./faucet/Potion.sol";
contract PotionScript is Script {
    Potion public potion;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();
        potion = new Potion(msg.sender);
        vm.stopBroadcast();
    }
}
