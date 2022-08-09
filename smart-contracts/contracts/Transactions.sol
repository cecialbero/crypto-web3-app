// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// @dev Stores transaction data inside of a TransferStruct

contract Transactions {
    uint transactionCount;

    event Transfer(address from, address receiver, uint amount, string message, uint timestamp, string keyword);

    struct TransferStruct {
        address sender;
        address receiver;
        uint amount;
        string message;
        uint timestamp;
        string keyword;
    }

    // Array of TransferStruct (transactions)
    TransferStruct[] transactions;

    function addToBlockchain(address payable _receiver, uint _amount, string memory _message, string memory _keyword) public {
        transactionCount++;
        transactions.push(TransferStruct(msg.sender, _receiver, _amount, _message, block.timestamp, _keyword));

        emit Transfer(msg.sender, _receiver, _amount, _message, block.timestamp, _keyword);
    }

    function getAllTransactions() public view returns(TransferStruct[] memory) {
        return transactions;
    }

    function getTransactionCount() public view returns(uint) {
        return transactionCount;
    }
}