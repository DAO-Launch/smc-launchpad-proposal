// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);

    function transfer(address recipient, uint256 amount) external returns (bool);
}

contract Launchpad is Ownable {
    address public token;
    uint256 public maxTokensToSell = 100000 ether; //100.000 token decimal = 18
    uint public startTime;
    uint public endTime;
    uint256 public maxBuy; // ETH decimal (10^18)
    uint256 public rate; // token per ETH decimal (10^18)

    mapping(address => uint256) public balances;
    mapping(address => uint256) public tokenBalances;
    uint256 public totalTokensSold;

    event Bought(address buyer, uint256 amount);

    constructor(address _token, uint256 _maxBuy, uint _startTime, uint _endTime, uint256 _rate) {
        token = _token;
        maxBuy = _maxBuy;
        startTime = _startTime;
        endTime = _endTime;
        rate = _rate;
    }

    function buyToken() external payable {
        require(msg.value > 0, "Value must be greater than zero");
        require(msg.sender != address(0), "Sender address cannot be 0x0");
        require(block.timestamp >= startTime, "Launchpad has not started yet");
        require(block.timestamp <= endTime, "Launchpad has ended");
        require(balances[msg.sender] + msg.value <= maxBuy, "Exceeds maximum buy limit");
        uint256 amount = msg.value * rate;
        require(amount > 0, "Amount must be greater than zero");
        require(totalTokensSold + amount <= maxTokensToSell, "Exceeds maximum tokens to sell");
        require(IERC20(token).balanceOf(address(this)) >= amount, "Insufficient tokens");
        balances[msg.sender] += msg.value;
        tokenBalances[msg.sender] += amount;
        totalTokensSold += amount;
        require(IERC20(token).transfer(msg.sender, amount), "Transfer failed");
        emit Bought(msg.sender, amount);
    }

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "Balance must be greater than zero");
        payable(owner()).transfer(balance);
    }

    function withdrawToken(address _anyToken) external onlyOwner {
        uint256 balance = IERC20(_anyToken).balanceOf(address(this));
        require(balance > 0, "Balance must be greater than zero");
        require(IERC20(_anyToken).transfer(owner(), balance), "Transfer failed");
    }

    function setMaxTokensToSell(uint256 _maxTokensToSell) external onlyOwner {
        require(_maxTokensToSell > 0, "Max tokens to sell must be greater than 0");
        maxTokensToSell = _maxTokensToSell;
    }

    function setToken(address _token) external onlyOwner {
        require(_token != address(0), "Token address cannot be 0x0");
        token = _token;
    }

    function setMaxBuy(uint256 _maxBuy) external onlyOwner {
        require(_maxBuy > 0, "Max buy amount must be greater than 0");
        maxBuy = _maxBuy;
    }

    function setStartTime(uint _startTime) external onlyOwner {
        require(_startTime > block.timestamp, "Start time must be in the future");
        startTime = _startTime;
    }

    function setEndTime(uint _endTime) external onlyOwner {
        require(_endTime > startTime, "End time must be after start time");
        endTime = _endTime;
    }

    function setRate(uint256 _rate) external onlyOwner {
        require(_rate > 0, "Rate must be greater than 0");
        rate = _rate;
    }
}
