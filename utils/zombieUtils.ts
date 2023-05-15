import { ContractFactory, providers } from "ethers";

import ZombieOwnership from ".artifacts/contracts/ZombieOwnership.sol/ZombieOwnership.json";
import ZombieContract from ".entities/zombieContract.interface";

export async function getZombieContract(ethereum: Record<string, any>) {
  const provider = new providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  // const zombieContract = new Contract(
  //   cryptoZombiesAddress,
  //   ZombieOwnership.abi,
  //   signer
  // );
  const factory = new ContractFactory(
    ZombieOwnership.abi,
    ZombieOwnership.bytecode,
    signer
  );
  // triggers the contract deployment
  const zombieContract = await factory.deploy();
  // checks if contract is available on the blockchain
  return (await zombieContract.deployed()) as ZombieContract;
}
