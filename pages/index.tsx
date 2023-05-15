import { utils } from "ethers";
import React, { useCallback, useContext, useState } from "react";

import { AccountContext } from ".components/AccountContext";
import ZombieContract from ".entities/zombieContract.interface";
import { isEthValid } from ".utils/ethUtils";
import { getZombieContract } from ".utils/zombieUtils";

export default function Home() {
  const { ethereum, connectedAccount, connectAccount } =
    useContext(AccountContext);
  const [zombieContract, setZombieContract] = useState({} as ZombieContract);

  const isZombieContractAvailable = useCallback(
    () => Object.keys(zombieContract).length > 0,
    [zombieContract]
  );

  if (!isEthValid(ethereum)) {
    return (
      <p>
        Please add a wallet provider (e.g. Brave, MetaMask) into the browser to
        connect to this site!
      </p>
    );
  }

  if (connectedAccount === "") {
    return (
      <div className="text-center">
        <p>Please connect a wallet provider!</p>
        <button
          className="border-2 px-4 py-2 mt-4 hover:opacity-50"
          type="button"
          onClick={connectAccount}
        >
          Connect
        </button>
      </div>
    );
  }

  if (!isZombieContractAvailable()) {
    getZombieContract(ethereum)
      .then((curContract) => {
        setZombieContract(curContract);
      })
      .catch((err: Error & Record<string, any>) => {
        if (err.code === 4001) {
          console.error(err.message);
        } else {
          console.error(err);
        }
      });
  }

  const getFee = async () => {
    const fee = await zombieContract.getLevelUpFee();
    console.log(utils.formatEther(fee));
  };

  const getZombieIdsByOwner = async () => {
    const zombie = await zombieContract.getZombieIdsByOwner(
      zombieContract.owner()
    );
    console.log(zombie);
  };

  return (
    <div className="text-center">
      <p>The start of our app!</p>
      <div>
        <button
          className="border-2 px-4 py-2 mt-4 hover:opacity-50 disabled:opacity-50"
          type="button"
          disabled={!isZombieContractAvailable()}
          onClick={getFee}
        >
          Get fee
        </button>
      </div>
      <div>
        <button
          className="border-2 px-4 py-2 mt-4 hover:opacity-50 disabled:opacity-50"
          type="button"
          disabled={!isZombieContractAvailable()}
          onClick={getZombieIdsByOwner}
        >
          Get list of owned zombies
        </button>
      </div>
    </div>
  );
}
