// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @title Wrapped ETH
/// @author https://github.com/treug0lnik041
contract WrappedETH is ERC20 {
    event Deposit(address indexed from, uint256 value);
    event Withdraw(address indexed to, uint256 value);

    constructor() ERC20("Wrapped ETH", "WETH") {}

    function decimals() public pure override(ERC20) returns (uint8) {
        return 18;
    }

    function totalSupply() public view override(ERC20) returns (uint256) {
        return address(this).balance;
    }

    function deposit() public payable {
        _mint(msg.sender, msg.value);
        emit Deposit(msg.sender, msg.value);
    }

    function withdraw(uint256 _amount) public {
        require(balanceOf(msg.sender) >= _amount, "Insufficient balance");
        require(_withdraw(_amount), "Unable to withdraw ETH");
        _burn(msg.sender, _amount);
        emit Withdraw(msg.sender, _amount);
    }

    function _withdraw(uint256 _amount) internal returns (bool) {
        return payable(address(msg.sender)).send(_amount);
    }
}
