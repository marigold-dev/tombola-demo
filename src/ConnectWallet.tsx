import React, { Dispatch, SetStateAction, useState, useEffect } from "react";
import { TezosToolkit } from "@taquito/taquito";
import { BeaconWallet } from "@taquito/beacon-wallet";
import {
  NetworkType
} from "@airgap/beacon-sdk";
import { Button } from "@mui/material";

type ButtonProps = {
  tezosUrl: string;
  setWallet: Dispatch<SetStateAction<any>>;
  setUserAddress: Dispatch<SetStateAction<string>>;
  wallet: BeaconWallet;
  network: string;
  setTezos: Dispatch<SetStateAction<TezosToolkit|undefined>>;
};

const ConnectButton = ({
  tezosUrl,
  setWallet,
  setUserAddress,
  wallet,
  network,
  setTezos
}: ButtonProps): JSX.Element => {

  const setup = async (userAddress: string): Promise<void> => {
    setUserAddress(userAddress);
  };

  const connectWallet = async (): Promise<void> => {
    try {
      await wallet.requestPermissions({
        network: {
          type: NetworkType[network.toUpperCase() as keyof typeof NetworkType],
          rpcUrl: tezosUrl
        }
      });
      // gets user's address
      const userAddress = await wallet.getPKH();
      await setup(userAddress);
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    (async () => {
      // creates a wallet instance if not exists
      if(!wallet){wallet = new BeaconWallet({
        name: "Tombola",
        preferredNetwork: NetworkType[network.toUpperCase() as keyof typeof NetworkType],
      });}
      const Tezos = new TezosToolkit(tezosUrl);
      Tezos.setWalletProvider(wallet);
      setTezos(Tezos);
      setWallet(wallet);
      // checks if wallet was connected before
      const activeAccount = await wallet.client.getActiveAccount();
      if (activeAccount) {
        const userAddress = await wallet.getPKH();
        await setup(userAddress);
      }
    })();
  }, []);

  return (
      <Button variant="contained" onClick={connectWallet}>
          <i className="fas fa-wallet"></i>&nbsp; Connect with wallet
      </Button>
  );
};

export default ConnectButton;
