import "../styles/globals.css";

import type { AppProps } from "next/app";
import { MetamaskProvider } from "../hooks/useMetamask";

// @ts-ignore
import {Web3} from 'web3'

import { CONTACT_ABI, CONTRACT_ADDRESS } from '../contract/config';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MetamaskProvider>
      <Component {...pageProps} />
    </MetamaskProvider>
  );
}

export default MyApp;
