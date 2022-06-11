import React, { Fragment, MouseEvent, useState } from "react";
import "./App.css";
import { NetworkType } from "@airgap/beacon-types";
import { Backdrop, Button, CircularProgress, TextField } from "@mui/material";
import ConnectButton from "./ConnectWallet";
import DisconnectButton from "./DisconnectWallet";
import { useSnackbar } from "notistack";
import { TezosToolkit, WalletContract, MichelsonMap } from "@taquito/taquito";
import { TransactionInvalidBeaconError } from "./TransactionInvalidBeaconError";
import { Header } from "./styles/Header";
import { Footer } from "./styles/Footer";
import tombola from "./images/tombola.jpeg";
import { Section, SubTitle, Title } from "./styles/section";
import { Mail } from "./styles/mail";
import { Buttons, Tombola, TombolaOff } from "./styles/Tombola";
class STATUS {
  oPEN: string | undefined;
  cLOSE: string | undefined;
}

class ContractStorage {
  participants!: MichelsonMap<string, string>;
  admin!: string;
  status!: STATUS;
}

function App() {
  const [network, setNetwork] = useState<string>(NetworkType.ITHACANET);
  const [tezosUrl, setTezosUrl] = useState<string>(
    "https://" + NetworkType.ITHACANET + ".tezos.marigold.dev"
  );
  const [Tezos, setTezos] = useState<TezosToolkit | undefined>();

  const [wallet, setWallet] = useState<any>(null);
  const [userAddress, setUserAddress] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string | undefined>();

  const [tezosLoading, setTezosLoading] = useState(false);

  const [contract, setContract] = useState<WalletContract | undefined>();
  const [contractStorage, setContractStorage] = useState<
    ContractStorage | undefined
  >();

  // MESSAGES
  const { enqueueSnackbar } = useSnackbar();

  const refreshStorage = async () => {
    if (Tezos && wallet) {
      let c = await Tezos!.wallet.at(process.env["REACT_APP_CONTRACT"]!);
      setContract(c);
      if (c) setContractStorage(await c.storage());
    }
  };

  React.useEffect(() => {
    (async () => {
      refreshStorage();
    })();
  }, [Tezos, wallet]);

  const handleParticipate = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    try {
      setTezosLoading(true);

      const op = await contract!.methods
        .participate(userEmail ? userEmail : "")
        .send();
      await op.confirmation(1);
      refreshStorage();
      enqueueSnackbar(
        "Thank you for your participation (you will notified later for the prize if you filled your email)",
        { variant: "success", autoHideDuration: 10000 }
      );
    } catch (error: any) {
      console.table(`Error: ${JSON.stringify(error, null, 2)}`);
      let tibe: TransactionInvalidBeaconError =
        new TransactionInvalidBeaconError(error);
      enqueueSnackbar(tibe.data_message, {
        variant: "error",
        autoHideDuration: 10000,
      });
      return;
    } finally {
      setTezosLoading(false);
    }
  };

  const handleClose = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    try {
      setTezosLoading(true);

      const op = await contract!.methods.close().send();
      await op.confirmation(1);
      refreshStorage();
      enqueueSnackbar("Tombola is closed now", {
        variant: "success",
        autoHideDuration: 10000,
      });
    } catch (error: any) {
      console.table(`Error: ${JSON.stringify(error, null, 2)}`);
      let tibe: TransactionInvalidBeaconError =
        new TransactionInvalidBeaconError(error);
      enqueueSnackbar(tibe.data_message, {
        variant: "error",
        autoHideDuration: 10000,
      });
      return;
    } finally {
      setTezosLoading(false);
    }
  };

  const handleReset = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    try {
      setTezosLoading(true);

      const op = await contract!.methods.reset().send();
      await op.confirmation(1);
      refreshStorage();
      enqueueSnackbar("Tombola has been reset", {
        variant: "success",
        autoHideDuration: 10000,
      });
    } catch (error: any) {
      console.table(`Error: ${JSON.stringify(error, null, 2)}`);
      let tibe: TransactionInvalidBeaconError =
        new TransactionInvalidBeaconError(error);
      enqueueSnackbar(tibe.data_message, {
        variant: "error",
        autoHideDuration: 10000,
      });
      return;
    } finally {
      setTezosLoading(false);
    }
  };

  return (
    <Fragment>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme: any) => theme.zIndex.drawer + 1 }}
        open={tezosLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Header>
        <h3>Tombola App</h3>
        {!userAddress ? (
          <ConnectButton
            tezosUrl={tezosUrl}
            setWallet={setWallet}
            setUserAddress={setUserAddress}
            wallet={wallet}
            network={network}
            setTezos={setTezos}
          />
        ) : (
          <DisconnectButton
            wallet={wallet}
            setUserAddress={setUserAddress}
            setWallet={setWallet}
            setNetwork={setNetwork}
          />
        )}
      </Header>
      <Section>
        <div>
          <Title>I am </Title>
          <SubTitle>{userAddress}</SubTitle>
        </div>

        <div>
          <Title>Participants count : </Title>{" "}
          <SubTitle>{contractStorage?.participants.size}</SubTitle>
        </div>

        <div className="admin-info">
          <div className="info">
          <Title>Tombola admin </Title>
          <a>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="48"
            viewBox="0 0 48 48"
            width="48"
          >
            <path d="M0 0h48v48h-48z" fill="none" />
            <path d="M22 34h4v-12h-4v12zm2-30c-11.05 0-20 8.95-20 20s8.95 20 20 20 20-8.95 20-20-8.95-20-20-20zm0 36c-8.82 0-16-7.18-16-16s7.18-16 16-16 16 7.18 16 16-7.18 16-16 16zm-2-22h4v-4h-4v4z" />
          </svg>
          </a>
          </div>
          <div className="code"><SubTitle>{contractStorage?.admin}</SubTitle></div>
        </div>

        {/* <div>
          <Title>Tombola status :</Title>{" "}
          <SubTitle>{contractStorage?.status.oPEN ? "OPEN" : "CLOSE"}</SubTitle>
        </div> */}
      </Section>
      <Mail>
        <h3>Enter your email </h3>
        <TextField
          id="outlined-basic"
          label="Email (optional)"
          variant="outlined"
          value={userEmail}
          type="email"
          onChange={(e) => setUserEmail(e.currentTarget.value)}
        />
      </Mail>
      {contractStorage?.admin == userAddress ? (
        <TombolaOff>
        <img className="off" src={tombola} alt="tombola" />
        <Title>Thank you for participating in the Tombola app!</Title>
        <Buttons>
        <Button variant="contained" onClick={(e) => handleClose(e)}>
            CLOSE
          </Button>
          <Button variant="contained" onClick={(e) => handleReset(e)}>
            RESET
          </Button>
        </Buttons>
        </TombolaOff>
      ) : (
        <Tombola>
          <Buttons>
          </Buttons>
           <img src={tombola} alt="tombola" />
        {!userAddress ? (
          <ConnectButton
            tezosUrl={tezosUrl}
            setWallet={setWallet}
            setUserAddress={setUserAddress}
            wallet={wallet}
            network={network}
            setTezos={setTezos}
          />
        ) : (
          <Button variant="contained" onClick={(e) => handleParticipate(e)}>
          PARTICIPATE
        </Button>
        )}
        </Tombola>
      )}

      {/* {contractStorage?.admin == userAddress ? (
        <Fragment>
          <Button variant="contained" onClick={(e) => handleClose(e)}>
            CLOSE
          </Button>
          <Button variant="contained" onClick={(e) => handleReset(e)}>
            RESET
          </Button>
        </Fragment>
      ) : (
        ""
      )} */}
      <Footer>
        <p>Tezos Foundation</p>
        <p>Powered by Marigold</p>
      </Footer>
    </Fragment>
  );
}

export default App;
