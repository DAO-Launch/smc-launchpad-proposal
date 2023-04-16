// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

library StructData {
    struct ProposalDetails {
        address creator;
        string proposalText;
        uint256 agreePower;
        uint256 disagreePower;
        uint256 abstainPower;
        bool proposalPassed;
        mapping(address => bool) hasVoted;
        mapping(address => uint8) voterChoice;
    }
}
