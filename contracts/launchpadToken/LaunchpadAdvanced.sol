// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

interface IERC20 {
    function balanceOf(address account) external view returns (uint);

    function transfer(address recipient, uint256 amount) external returns (bool);

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);
}

contract LaunchpadAdvanced is Ownable {
    address public token;
    uint256 public maxTokensToSell = 100000 ether; //100.000 token decimal = 18
    uint public startTime;
    uint public endTime;
    address public acceptedToken; // AcceptToken such as USDT, USDC, WBNB...
    uint256 public maxBuy; //AcceptToken with decimal(10^18)
    uint256 public rate; //token per AcceptToken with decimal(10^18)

    mapping(address => uint256) public balances;
    mapping(address => uint256) public tokenBalances;
    uint256 public totalTokensSold;

    event Bought(address buyer, uint amount);

    constructor(
        address _token,
        uint256 _maxBuy,
        uint _startTime,
        uint _endTime,
        uint256 _rate,
        address _acceptedToken
    ) {
        token = _token;
        maxBuy = _maxBuy;
        startTime = _startTime;
        endTime = _endTime;
        rate = _rate;
        acceptedToken = _acceptedToken;
    }

    function buyToken(uint256 _amountAcceptToken) external payable {
        require(_amountAcceptToken >= 0, "Must not be zero value");
        require(msg.sender != address(0), "Sender address cannot be 0x0");
        require(block.timestamp >= startTime, "Launchpad has not started yet");
        require(block.timestamp <= endTime, "Launchpad has ended");
        require(balances[msg.sender] + _amountAcceptToken <= maxBuy, "Exceeds maximum buy limit");
        uint amount = _amountAcceptToken * rate;
        require(amount > 0, "Amount must be greater than zero");
        require(totalTokensSold + amount <= maxTokensToSell, "Exceeds maximum tokens to sell");
        require(IERC20(token).balanceOf(address(this)) >= amount, "Insufficient tokens");
        require(
            IERC20(acceptedToken).balanceOf(msg.sender) >= _amountAcceptToken,
            "Insufficient balance"
        );
        require(
            IERC20(acceptedToken).transferFrom(msg.sender, address(this), _amountAcceptToken),
            "Transfer failed"
        );
        balances[msg.sender] += _amountAcceptToken;
        tokenBalances[msg.sender] += amount;
        totalTokensSold += amount;
        require(IERC20(token).transfer(msg.sender, amount), "Transfer failed");
        emit Bought(msg.sender, _amountAcceptToken);
    }

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "Balance must be greater than zero");
        payable(owner()).transfer(balance);
    }

    function withdrawToken(address _anyToken) external onlyOwner {
        uint balance = IERC20(_anyToken).balanceOf(address(this));
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

    function setTokenAccept(address _newAcceptedToken) external onlyOwner {
        require(_newAcceptedToken != address(0), "Token address cannot be 0x0");
        acceptedToken = _newAcceptedToken;
    }

    function setMaxBuy(uint _maxBuy) external onlyOwner {
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

    function setRate(uint _rate) external onlyOwner {
        require(_rate > 0, "Rate must be greater than 0");
        rate = _rate;
    }
}
