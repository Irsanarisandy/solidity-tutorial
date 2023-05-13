// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.18;

import "./ZombieHelper.sol";

contract ZombieAttack is ZombieHelper {
  uint randNonce = 0;
  uint attackVictoryProbability = 70;

  function _randMod(uint _modulus) internal returns(uint) {
    /**
     * This method is vulnerable to attack by a dishonest node. For alternative ways to
     * generate random numbers safely, check the link below for some ideas:
     * https://ethereum.stackexchange.com/questions/191/how-can-i-securely-generate-a-random-number-in-my-smart-contract
    **/
    randNonce++;
    return uint(keccak256(abi.encodePacked(block.timestamp, msg.sender, randNonce))) % _modulus;
  }

  function attack(uint _zombieId, uint _targetId) external onlyOwnerOf(_zombieId) {
    Zombie storage myZombie = zombies[_zombieId];
    Zombie storage enemyZombie = zombies[_targetId];
    uint rand = _randMod(100);
    if (rand <= attackVictoryProbability) {
      myZombie.winCount++;
      myZombie.level++;
      enemyZombie.lossCount++;
      _feedAndMultiply(_zombieId, enemyZombie.dna, "zombie");
    } else {
      myZombie.lossCount++;
      enemyZombie.winCount++;
      _triggerCooldown(myZombie);
    }
  }
}
