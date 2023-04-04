import Link from "next/link";
import { useListen } from "../hooks/useListen";
import { useMetamask } from "../hooks/useMetamask";
import { Loading } from "./Loading";
import {useState} from "react";

export default function Wallet() {
  const {
    dispatch,
    state: { status, isMetamaskInstalled, wallet, balance },
  } = useMetamask();
  const listen = useListen();

  const showInstallMetamask =
    status !== "pageNotLoaded" && !isMetamaskInstalled;
  const showConnectButton =
    status !== "pageNotLoaded" && isMetamaskInstalled && !wallet;

  const isConnected = status !== "pageNotLoaded" && typeof wallet === "string";

  const handleConnect = async () => {
    dispatch({ type: "loading" });
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    if (accounts.length > 0) {
      const balance = await window.ethereum!.request({
        method: "eth_getBalance",
        params: [accounts[0], "latest"],
      });
      dispatch({ type: "connect", wallet: accounts[0], balance });

      // we can register an event listener for changes to the users wallet
      listen();
    }
  };

  const handleDisconnect = () => {
    dispatch({ type: "disconnect" });
  };

  const handleAddUsdc = async () => {
    dispatch({ type: "loading" });

    await window.ethereum.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20",
        options: {
          address: "0xE44fa14881b192Be661ad5ec23227B9924079f80",
          symbol: "USDC",
          decimals: 18,
          image: "https://cryptologos.cc/logos/usd-coin-usdc-logo.svg?v=023",
        },
      },
    });
    dispatch({ type: "idle" });
  };


  const translateAddres=(addres:string)=>{
    let result='';
    for(let i=0;i<10;i++){
      result+=addres[i]
    }
    result+='...';
    for(let i=addres.length-1;i>addres.length-3;i--){
      result+=addres[i]
    }
    return result
  }

  const [showDrop,setShowDrop]=useState(true)

  return (
    <div className="w-40 cursor-pointer text-xs leading-3 sm:text-lg text-center sm:mx-6 font-black text-violet h-7 flex items-center justify-center rounded-full">

      {/*<h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">*/}
      {/*  <span className="block">Metamask API intro</span>*/}
      {/*</h2>*/}
      {/*<p className="mt-4 text-lg leading-6 text-white">*/}
      {/*  Follow along with the{" "}*/}
      {/*  <Link*/}
      {/*    href="https://github.com/GuiBibeau/web3-unleashed-demo"*/}
      {/*    target="_blank"*/}
      {/*  >*/}
      {/*    <span className="underline cursor-pointer">Repo</span>*/}
      {/*  </Link>{" "}*/}
      {/*  in order to learn how to use the Metamask API.*/}
      {/*</p>*/}

      {/*{wallet && balance && (*/}
      {/*  <div className=" px-4 py-5 sm:px-6">*/}
      {/*    <div className="-ml-4 -mt-4 flex flex-wrap items-center justify-between sm:flex-nowrap">*/}
      {/*      <div className="ml-4 mt-4">*/}
      {/*        <div className="flex items-center">*/}
      {/*          <div className="ml-4">*/}
      {/*            <h3 className="text-lg font-medium leading-6 text-white">*/}
      {/*              Address: <span>{wallet}</span>*/}
      {/*            </h3>*/}
      {/*            <p className="text-sm text-white">*/}
      {/*              Balance:{" "}*/}
      {/*              <span>*/}
      {/*                {(parseInt(balance) / 1000000000000000000).toFixed(4)}{" "}*/}
      {/*                ETH*/}
      {/*              </span>*/}
      {/*            </p>*/}
      {/*          </div>*/}
      {/*        </div>*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*)}*/}


      {showConnectButton && (
          <button
              onClick={handleConnect}
              className="w-full relative items-center border-2 rounded-full w-full h-full bg-blue border-blue justify-center text-violet text-sm font-medium"
          >
            {status === "loading" ? <Loading /> : "Connect Wallet"}
          </button>
      )}

      {/*{showInstallMetamask && (*/}
      {/*  <Link*/}
      {/*    href="https://metamask.io/"*/}
      {/*    target="_blank"*/}
      {/*    className="mt-8 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-ganache text-white px-5 py-3 text-base font-medium  sm:w-auto"*/}
      {/*  >*/}
      {/*    Install Metamask*/}
      {/*  </Link>*/}
      {/*)}*/}

      {isConnected&&balance && (
          <div className="flex relative w-full justify-center space-x-2">
            <button
                onClick={()=>{setShowDrop(!showDrop)}}
                className="inline-flex w-full items-center justify-center border-2 border-white text-blue rounded-full h-full text-white px-2 text-base font-medium  sm:w-auto"
            >
              {wallet?translateAddres(wallet):'Disconnect'}
              {showDrop?<div className={'w-full rounded-xl absolute top-8 border-2 border-white flex justify-center flex-col h-20 bg-blue'}>
                <p className="text-xs mt-2 text-violet">
                  Balance:{" "}
                  <span>
                      {(parseInt(balance) / 1000000000000000000).toFixed(4)}{" "}
                    BNB
                    </span>
                </p>
                <p className="text-xl mt-2 underline font-black text-violet" onClick={()=>{handleDisconnect()}}>
                  Disconnect
                </p>
              </div>:null}
            </button>
          </div>
      )}

    </div>
  );
}
