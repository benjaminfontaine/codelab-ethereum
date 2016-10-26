pragma solidity ^0.4.0;
contract owned {
  address owner;
  function owned() {
    owner = msg.sender;
  }
  function changeOwner(address newOwner) onlyowner {
    owner = newOwner;
  }
  modifier onlyowner() {
    if (msg.sender==owner){
      _;
    } else {
      throw;
    }

  }
}
