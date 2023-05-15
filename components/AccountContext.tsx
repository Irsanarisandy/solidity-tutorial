import React, {
  type PropsWithChildren,
  createContext,
  useEffect,
  useState,
} from "react";

import { isEthValid } from ".utils/ethUtils";

const chainIdsMap: Record<string, string> = {
  "0x1": "Ethereum main network",
  "0xaa36a7": "Sepolia test network",
  "0x539": "Localhost test network",
};

const initialState: {
  ethereum: Record<string, any>;
  connectedAccount: string;
  connectAccount: () => Promise<void>;
} = {
  ethereum: {},
  connectedAccount: "",
  connectAccount: async () => {},
};

export const AccountContext = createContext(initialState);

export default function AccountProvider({ children }: PropsWithChildren) {
  const [ethereum, setEthereum] = useState<Record<string, any>>({});
  const [connectedAccount, setConnectedAccount] = useState("");

  const handleAccounts = (accounts: string[] | undefined) => {
    if (accounts == null || accounts.length === 0) {
      return;
    }
    if (connectedAccount !== accounts[0]) {
      const account = accounts[0];
      console.log("We have an authorized account: ", account);
      setConnectedAccount(account);
    }
  };

  const connectAccount = async () => {
    if (!isEthValid(ethereum)) {
      console.error("Ethereum object is required to connect an account");
      return;
    }

    const accounts = await ethereum
      .request({ method: "eth_requestAccounts" })
      .catch((err: Error & Record<string, any>) => {
        if (err.code === 4001) {
          console.error("Please connect to a crypto wallet account!");
        } else {
          console.error(err);
        }
      });
    handleAccounts(accounts);
  };

  const value = { ethereum, connectedAccount, connectAccount };

  useEffect(() => {
    const setEthereumFromWindow = async () => {
      const curEthereum = (window as any).ethereum;
      if (isEthValid(curEthereum)) {
        const siteChainId = process.env.NEXT_PUBLIC_CHAIN_ID_HEX || "0x1";
        // https://docs.metamask.io/wallet/get-started/detect-network
        curEthereum.on("chainChanged", () => location.reload());
        const reqChainId = await curEthereum.request({ method: "eth_chainId" });
        if (reqChainId === siteChainId) {
          setEthereum(curEthereum);
        } else {
          alert(
            `Please use ${
              chainIdsMap.hasOwnProperty(siteChainId)
                ? chainIdsMap[siteChainId]
                : `network with chain ID ${siteChainId}`
            }!`
          );
        }
      }
    };

    setEthereumFromWindow();
  }, []);

  useEffect(() => {
    const getConnectedAccount = async () => {
      if (isEthValid(ethereum)) {
        const accounts = await ethereum
          .request({ method: "eth_accounts" })
          .catch((err: Error) => {
            console.error(err);
          });
        handleAccounts(accounts);
      }
    };

    getConnectedAccount();
  });

  return (
    <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
  );
}
