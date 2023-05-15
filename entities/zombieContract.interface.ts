import { BigNumberish, Contract } from "ethers";

interface Zombie {
  name: string;
  dna: number;
  level: number;
  readyTime: number;
  winCount: number;
  lossCount: number;
}

export default interface ZombieContract extends Contract {
  approve: (approvedAddress: string, tokenId: number) => Promise<void>;
  attack: (zombieId: number, targetId: number) => Promise<void>;
  balanceOf: (ownerAddress: string) => Promise<BigNumberish>;
  changeDna: (zombieId: number, newDna: number) => Promise<void>;
  changeName: (zombieId: number, newName: string) => Promise<void>;
  createRandomZombie: (name: string) => Promise<void>;
  feedOnKitty: (zombieId: number, kittyId: number) => Promise<void>;
  getLevelUpFee: () => Promise<BigNumberish>;
  getZombieDetail: (zombieId: number) => Promise<Zombie>;
  getZombieIdsByOwner: (ownerAddress: string) => Promise<BigNumberish[]>;
  levelUp: (
    zombieId: number,
    payableObject: Record<string, number>
  ) => Promise<void>;
  ownerOf: (zombieId: number) => Promise<string>;
  setKittyContractAddress: (ownerAddress: string) => Promise<void>;
  setLevelUpFee: (fee: number) => Promise<void>;
  transferFrom: (from: string, to: string, tokenId: number) => Promise<void>;
  withdraw: () => Promise<void>;
}
