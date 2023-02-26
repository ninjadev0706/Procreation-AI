import { useMemo } from 'react';
import type { AppProps } from 'next/app';
import type { NextPageWithLayout } from '@/types';
import Head from 'next/head';
import { ToastContainer } from 'react-toastify';

import { clusterApiUrl } from '@solana/web3.js';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';

import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from 'next-themes';
import ModalsContainer from '@/components/modal-views/container';
import DrawersContainer from '@/components/drawer-views/container';
import SettingsButton from '@/components/settings/settings-button';
import SettingsDrawer from '@/components/settings/settings-drawer';
// import { WalletProvider } from '@/lib/hooks/use-connect';
import 'overlayscrollbars/css/OverlayScrollbars.css';
// base css file
import 'swiper/css';
import '@/assets/css/scrollbar.css';
import '@/assets/css/globals.css';
import '@/assets/css/range-slider.css';
import '@solana/wallet-adapter-react-ui/styles.css';

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function CustomApp({ Component, pageProps }: AppPropsWithLayout) {
  //could remove this if you don't need to page level layout
  const getLayout = Component.getLayout ?? ((page) => page);

  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(() => [new PhantomWalletAdapter()], [network]);

  return (
    <>
      <Head>
        {/* maximum-scale 1 meta tag need to prevent ios input focus auto zooming */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1 maximum-scale=1"
        />
        <title>Criptic - React Next Web3 NFT Crypto Dashboard Template</title>
      </Head>
      <ThemeProvider
        attribute="class"
        enableSystem={false}
        defaultTheme="light"
      >
        <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={wallets} autoConnect>
            <WalletModalProvider>
              {getLayout(<Component {...pageProps} />)}
              <SettingsButton />
              <SettingsDrawer />
              <ModalsContainer />
              <DrawersContainer />
              <ToastContainer />
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </ThemeProvider>
    </>
  );
}

export default CustomApp;
