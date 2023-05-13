// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ZombieFactory is Ownable {
  event NewZombie(uint zombieId, string name, uint dna);

  struct Zombie {
    string name;
    uint dna;
    uint32 level;
    uint32 readyTime;
    uint16 winCount;
    uint16 lossCount;
  }

  uint dnaDigits = 16;
  uint dnaModulus = 10 ** dnaDigits;
  uint cooldownTime = 1 days;

  Zombie[] zombies;

  mapping (address => uint) ownerZombieCount;
  mapping (uint => address) zombieToOwner;

  function _createZombie(string memory _name, uint _dna) internal {
    zombies.push(Zombie(_name, _dna, 1, uint32(block.timestamp + cooldownTime), 0, 0));
    uint id = zombies.length - 1;
    zombieToOwner[id] = msg.sender;
    ownerZombieCount[msg.sender]++;  // default value of int/uint is 0
    emit NewZombie(id, _name, _dna);
  }

  function _generateRandomDna(string memory _str) private view returns (uint) {
    uint rand = uint(keccak256(abi.encodePacked(_str)));
    return rand % dnaModulus;
  }

  function createRandomZombie(string memory _name) public {
    require(ownerZombieCount[msg.sender] == 0, "You already have 1 or more zombies!");
    uint randDna = _generateRandomDna(_name);
    _createZombie(_name, randDna);
  }
}
