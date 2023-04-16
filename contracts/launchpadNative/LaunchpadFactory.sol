// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./Launchpad.sol";

contract LaunchpadFactory {
    event LaunchpadCreated(address indexed launchpad, address indexed owner);

    function createLaunchpad(
        address _token,
        uint256 _maxBuy,
        uint _startTime,
        uint _endTime,
        uint256 _rate
    ) external returns (address) {
        Launchpad newLaunchpad = new Launchpad(_token, _maxBuy, _startTime, _endTime, _rate);
        newLaunchpad.transferOwnership(msg.sender);
        emit LaunchpadCreated(address(newLaunchpad), msg.sender);
        return address(newLaunchpad);
    }
}
