// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {Weapon} from "./faucet/Weapon.sol";
contract WeaponScript is Script {
    Weapon public weapon;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();
        weapon = new Weapon();
        vm.stopBroadcast();
    }
}
