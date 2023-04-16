// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "../data/StructData.sol";
import "../launchpadNative/ILaunchpad.sol";

contract Proposal is Ownable {
    address launchpad;
    uint8 threshold = 50;
    uint public proposalId;
    mapping(uint => StructData.ProposalDetails) public proposalDetails;

    event ProposalCreated(uint indexed _proposalId, address indexed _creator, string _proposalText);
    event ProposalVoted(uint indexed _proposalId, address indexed _voter, uint8 _choice);

    constructor(address _launchpad) {
        require(_launchpad != address(0), "Invalid launchpad address");
        launchpad = _launchpad;
    }

    function createProposal(string memory _proposalText) public {
        require(bytes(_proposalText).length > 0, "Proposal text cannot be empty");
        proposalId++;
        StructData.ProposalDetails storage details = proposalDetails[proposalId];
        details.creator = msg.sender;
        details.proposalText = _proposalText;
        emit ProposalCreated(proposalId, msg.sender, _proposalText);
    }

    function vote(uint _proposalId, uint8 _choice) public {
        StructData.ProposalDetails storage details = proposalDetails[_proposalId];
        require(details.creator != address(0), "Proposal does not exist");
        require(!details.hasVoted[msg.sender], "You have already voted");
        require(!details.proposalPassed, "Proposal has passed");
        require(_choice == 1 || _choice == 2 || _choice == 3, "Invalid choice");

        details.hasVoted[msg.sender] = true;
        details.voterChoice[msg.sender] = _choice;

        uint256 voterPower = getUserPower(msg.sender);

        if (_choice == 1) {
            details.agreePower += voterPower;
        } else if (_choice == 2) {
            details.disagreePower += voterPower;
        } else {
            details.abstainPower += voterPower;
        }

        emit ProposalVoted(_proposalId, msg.sender, _choice);
    }

    function getProposalResult(
        uint _proposalId
    ) public view returns (bool, uint256, uint256, uint256) {
        StructData.ProposalDetails storage details = proposalDetails[_proposalId];
        require(details.creator != address(0), "Proposal does not exist");

        if (details.proposalPassed) {
            return (true, details.agreePower, details.disagreePower, details.abstainPower);
        } else {
            return (false, details.agreePower, details.disagreePower, details.abstainPower);
        }
    }

    function executeProposal(uint _proposalId) public onlyOwner {
        StructData.ProposalDetails storage details = proposalDetails[_proposalId];
        require(details.creator != address(0), "Proposal does not exist");
        require(!details.proposalPassed, "Proposal has already passed");

        uint256 totalPowerVotes = details.agreePower + details.disagreePower + details.abstainPower;
        uint agreePercentage = (details.agreePower * 100) / totalPowerVotes;
        uint disagreePercentage = (details.disagreePower * 100) / totalPowerVotes;

        if (agreePercentage >= threshold) {
            details.proposalPassed = true;
            // execute proposal here
        } else if (disagreePercentage >= threshold) {
            details.proposalPassed = false;
        } else {
            if (agreePercentage >= disagreePercentage) {
                details.proposalPassed = true;
            } else {
                details.proposalPassed = false;
            }
        }
    }

    function setThreshold(uint8 _newThreshold) public onlyOwner {
        require(
            _newThreshold >= 30 && _newThreshold < 100 && _newThreshold != threshold,
            "Invalid threshold value"
        );
        threshold = _newThreshold;
    }

    function getUserPower(address _user) public view returns (uint256) {
        return ILaunchpad(launchpad).tokenBalances(_user);
    }
}
