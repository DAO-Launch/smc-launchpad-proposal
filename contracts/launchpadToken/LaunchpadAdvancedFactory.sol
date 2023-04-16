// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./LaunchpadAdvanced.sol";

contract LaunchpadAdvancedFactory {
    event LaunchpadAdvancedCreated(address indexed launchpad, address indexed owner);

    function createLaunchpad(
        address _token,
        uint256 _maxBuy,
        uint _startTime,
        uint _endTime,
        uint256 _rate,
        address _acceptedToken
    ) external returns (address) {
        LaunchpadAdvanced newLaunchpad = new LaunchpadAdvanced(
            _token,
            _maxBuy,
            _startTime,
            _endTime,
            _rate,
            _acceptedToken
        );
        newLaunchpad.transferOwnership(msg.sender);
        emit LaunchpadAdvancedCreated(address(newLaunchpad), msg.sender);
        return address(newLaunchpad);
    }
}
