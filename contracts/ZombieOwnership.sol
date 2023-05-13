// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./ZombieAttack.sol";

contract ZombieOwnership is ERC721, ZombieAttack {
  constructor() ERC721("ZombieCollectible", "ZOM") {}

  mapping (uint => address) zombieApprovals;

  function balanceOf(address _owner) public view override returns (uint) {
    return ownerZombieCount[_owner];
  }

  function ownerOf(uint _tokenId) public view override returns (address) {
    return zombieToOwner[_tokenId];
  }

  function _transfer(address _from, address _to, uint _tokenId) internal override {
    ownerZombieCount[_from]--;
    ownerZombieCount[_to]++;
    zombieToOwner[_tokenId] = _to;
    emit Transfer(_from, _to, _tokenId);
  }

  function transferFrom(address _from, address _to, uint _tokenId) public override {
    require(zombieToOwner[_tokenId] == msg.sender || zombieApprovals[_tokenId] == msg.sender);
    _transfer(_from, _to, _tokenId);
  }

  function approve(address _approved, uint _tokenId) public override onlyOwnerOf(_tokenId) {
    zombieApprovals[_tokenId] = _approved;
    emit Approval(msg.sender, _approved, _tokenId);
  }
}
