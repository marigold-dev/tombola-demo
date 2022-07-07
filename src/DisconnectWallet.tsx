import React, { Dispatch, SetStateAction } from "react";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { Button } from "@mui/material";
import { NetworkType } from "@airgap/beacon-sdk";
import { TezosToolkit } from "@taquito/taquito";

interface ButtonProps {
  wallet: BeaconWallet | null;
  setUserAddress: Dispatch<SetStateAction<string>>;
  setWallet: Dispatch<SetStateAction<any>>;
  setNetwork: Dispatch<SetStateAction<string>>;
}

const DisconnectButton = ({
  wallet,
  setUserAddress,
  setWallet,
  setNetwork,
}: ButtonProps): JSX.Element => {
  const disconnectWallet = async (): Promise<void> => {
    //window.localStorage.clear();
    setUserAddress("");
    setWallet(null);
    setNetwork(NetworkType.JAKARTANET);
    console.log("disconnecting wallet");
    if (wallet) {
      await wallet.client.removeAllAccounts();
      await wallet.client.removeAllPeers();
      await wallet.client.destroy();
    }
  };

  return (
      <Button variant="contained" onClick={disconnectWallet}>
        <i className="fas fa-times"></i>&nbsp; Disconnect wallet
      </Button>
  );
};

export default DisconnectButton;
