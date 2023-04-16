// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface ILaunchpadAdvanced {
    function buyToken(uint256 _amountAcceptToken) external payable;

    function withdraw() external;

    function withdrawToken(address _anyToken) external;

    function setToken(address _token) external;

    function setTokenAccept(address _newAcceptedToken) external;

    function setMaxBuy(uint _maxBuy) external;

    function setStartTime(uint _startTime) external;

    function setEndTime(uint _endTime) external;

    function setRate(uint _rate) external;

    function token() external view returns (address);

    function owner() external view returns (address payable);

    function startTime() external view returns (uint);

    function endTime() external view returns (uint);

    function acceptedToken() external view returns (address);

    function maxBuy() external view returns (uint256);

    function rate() external view returns (uint256);

    function balances(address _buyer) external view returns (uint256);

    function tokenBalances(address _buyer) external view returns (uint256);

    event Bought(address buyer, uint amount);
}
