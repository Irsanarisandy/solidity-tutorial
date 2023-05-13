// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.18;

import "./ZombieFeeding.sol";

contract ZombieHelper is ZombieFeeding {
  uint levelUpFee = 0.001 ether;

  modifier aboveLevel(uint _level, uint _zombieId) {
    require(zombies[_zombieId].level >= _level);
    _;
  }

  function withdraw() external onlyOwner {
    address payable _owner = payable(owner());
    _owner.transfer(address(this).balance);
  }

  function getLevelUpFee() external view onlyOwner returns (uint) {
    return levelUpFee;
  }

  function setLevelUpFee(uint _fee) external onlyOwner {
    levelUpFee = _fee;
  }

  function levelUp(uint _zombieId) external payable {
    require(msg.value == levelUpFee, "Payment amount is insufficient!");
    zombies[_zombieId].level++;
  }

  function changeName(uint _zombieId, string calldata _newName) external aboveLevel(2, _zombieId) onlyOwnerOf(_zombieId) {
    zombies[_zombieId].name = _newName;
  }

  function changeDna(uint _zombieId, uint _newDna) external aboveLevel(20, _zombieId) onlyOwnerOf(_zombieId) {
    zombies[_zombieId].dna = _newDna;
  }

  function getZombieDetail(uint _zombieId) external view returns (Zombie memory) {
    return zombies[_zombieId];
  }

  function getZombieIdsByOwner(address _owner) external view returns(uint[] memory) {
    /**
     * A simpler implementation would be to have a public mapping in ZombieFactory:
     * mapping (address => uint[]) public ownerToZombies
     * This would include doing `ownerToZombies[owner].push(zombieId)` for every new zombie.
     * But if need to transfer a zombie from an owner to another:
     * 1. Push the zombie to the new owner's ownerToZombies value array.
     * 2. Remove the zombie from the old owner's ownerToZombies array.
     * 3. Shift every zombie in the older owner's array up one place to fill the hole.
     * 4. Reduce the array length by 1.
     * Step 3 would be extremely expensive gas-wise, since we'd have to do a write for every
     * zombie whose position we shifted. If an owner has 20 zombies and trades away the first
     * one, we would have to do 19 writes to maintain the order of the array.
     * Of course, we could just move the last zombie in the array to fill the missing slot
     * and reduce the array length by one, but then we would change the ordering of our zombie
     * army every time we made a trade.
    **/
    uint[] memory result = new uint[](ownerZombieCount[_owner]);
    uint counter = 0;
    for (uint i = 0; i < zombies.length; i++) {
      if (zombieToOwner[i] == _owner) {
        result[counter] = i;
        counter++;
      }
    }
    return result;
  }
}
