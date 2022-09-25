// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Author: @leotech.eth
contract Atticc {
    event Tip(address indexed sender, address indexed author, string indexed postIndex, string postId, uint amount);

    function tip(string memory postId, address payable _author) external payable {  
         (bool sent,) = _author.call{value: msg.value}("");
        require(sent, "Failed to send Ether");
        emit Tip(msg.sender, _author, postId, postId, msg.value);
    }
}

