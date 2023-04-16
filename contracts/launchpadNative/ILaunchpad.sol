// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface ILaunchpad {
    function buyToken() external payable;

    function withdraw() external;

    function withdrawToken(address _anyToken) external;

    function setToken(address _token) external;

    function setMaxBuy(uint256 _maxBuy) external;

    function setStartTime(uint _startTime) external;

    function setEndTime(uint _endTime) external;

    function setRate(uint256 _rate) external;

    function token() external view returns (address);

    function owner() external view returns (address payable);

    function startTime() external view returns (uint);

    function endTime() external view returns (uint);

    function maxBuy() external view returns (uint256);

    function rate() external view returns (uint256);

    function balances(address _account) external view returns (uint256);

    function tokenBalances(address _account) external view returns (uint256);

    event Bought(address indexed buyer, uint256 amount);
}
