// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/CounterFactory.sol";
import "../src/Counter.sol";

contract CounterFactoryTest is Test {
    CounterFactory public factory;
    address public user = address(0x1);

    function setUp() public {
        factory = new CounterFactory();
    }

    function testCreateCounter() public {
        vm.startPrank(user);

        address counterAddress = factory.createCounter();

        // Check if the counter was created
        assertTrue(counterAddress != address(0), "Counter should be created");

        // Check if the counter is stored in the creations mapping
        address[] memory userCounters = factory.getUserCounters(user);
        assertEq(userCounters.length, 1, "User should have 1 counter");
        assertEq(userCounters[0], counterAddress, "Created counter should be stored in creations");

        // Check if the created counter has the correct owner
        Counter counter = Counter(counterAddress);
        assertEq(counter.owner(), user, "Counter should be owned by the user");

        vm.stopPrank();
    }

    function testMultipleCounters() public {
        vm.startPrank(user);
        
        uint256 numCounters = 3;
        address[] memory createdCounters = new address[](numCounters);
        
        for (uint256 i = 0; i < numCounters; i++) {
            createdCounters[i] = factory.createCounter();
        }
        
        // Check if all counters are stored in the creations mapping
        address[] memory userCounters = factory.getUserCounters(user);
        assertEq(userCounters.length, numCounters, "User should have correct number of counters");
        
        for (uint256 i = 0; i < numCounters; i++) {
            assertEq(userCounters[i], createdCounters[i], "Created counter should be stored in creations");
            
            Counter counter = Counter(createdCounters[i]);
            assertEq(counter.owner(), user, "Counter should be owned by the user");
        }

        vm.stopPrank();
    }
}