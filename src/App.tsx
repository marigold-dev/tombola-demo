import React, { Fragment, MouseEvent, useState } from "react";
import "./App.css";
import { NetworkType } from "@airgap/beacon-types";
import { Backdrop, Button, CircularProgress, Icon, IconButton, TextField, Tooltip } from "@mui/material";
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
import InfoIcon from '@mui/icons-material/Info';
import { AccountBalanceWalletOutlined, Delete, DeleteOutline, DeleteOutlined, InfoOutlined } from "@mui/icons-material";
import { STATUS_CODES } from "http";

class STATUS {
  public oPEN: string | undefined;
  public cLOSE: string | undefined;
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
        <h3>Tombola</h3>
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
            
            
            {contractStorage && !contractStorage?.status.oPEN ? (
              <TombolaOff>
                          
              
              <img className="off" src={tombola} alt="tombola" />
              <Title style={{textAlign: "center"}}>Thank you for participating in the Tombola app!</Title>
              
              {userAddress === contractStorage?.admin ?
                <Button variant="contained" onClick={(e) => handleReset(e)}>
                RESET
                </Button> : ""}
                

                { 
                Array.from(contractStorage?.participants.keys()).map(p => 
                 <div>{p == userAddress ? <b>{p}</b> : p}</div> )
                }


                </TombolaOff>
                ) : (
                  <Tombola>
                  
                 <div>{userAddress? <span style={{    display: "flex"}}><AccountBalanceWalletOutlined /> &nbsp;{userAddress}</span>  :""}</div>
                  
                  <span>{contractStorage?.participants.size} participants
                                
                  
                  <Tooltip  style={{marginLeft:"10vw"}} enterDelay={0} title={contractStorage?contractStorage.admin:"."}>
                  <span>
                  Administrator 
                    <Icon>
                  <InfoOutlined fontSize="small"/>
                  </Icon >
                  </span>
                  </Tooltip>
                  </span>
                  
                  <img style={{margin:" 5vh 10vw"}} src={tombola} alt="tombola" />
                  
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
                      
                      <Fragment>
                      <Mail>
                      <TextField
                      id="outlined-basic"
                      label="Email (optional)"
                      variant="outlined"
                      value={userEmail}
                      type="email"
                      onChange={(e) => setUserEmail(e.currentTarget.value)}
                      />
                      </Mail>
                      
                      <Button variant="contained" onClick={(e) => handleParticipate(e)}>
                      PARTICIPATE
                      </Button>
                      </Fragment>
                      )}
                      
                      
                      {userAddress === contractStorage?.admin ?
                        <Button variant="contained" onClick={(e) => handleClose(e)}>
                        CLOSE
                        </Button>
                        :""
                      }
                      
                      
                      </Tombola>
                      )}
                      <Footer>
                      <p>Tezos Foundation</p>
                      <p>Powered by Marigold</p>
                      </Footer>
                      </Fragment>
                      );
                    }
                    
                    export default App;
                    