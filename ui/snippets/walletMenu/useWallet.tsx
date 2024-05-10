import { useWeb3Modal, useWeb3ModalState } from '@web3modal/wagmi/react';
import React from 'react';
import { useAccount, useDisconnect, useAccountEffect } from 'wagmi';

import * as mixpanel from 'lib/mixpanel/index';

interface Params {
  source: mixpanel.EventPayload<mixpanel.EventTypes.WALLET_CONNECT>['Source'];
}

export default function useWallet({ source }: Params) {
  const { open } = useWeb3Modal();
  const { open: isOpen } = useWeb3ModalState();
  const { disconnect } = useDisconnect();
  const [ isModalOpening, setIsModalOpening ] = React.useState(false);
  const [ isClientLoaded, setIsClientLoaded ] = React.useState(false);
  const isConnectionStarted = React.useRef(false);

  React.useEffect(() => {
    setIsClientLoaded(true);
  }, []);

  const handleConnect = React.useCallback(async() => {
    setIsModalOpening(true);
    console.log('A');
    let wallets = document.querySelectorAll('.wui-list-wallet');
    console.log(wallets);
    await open();
    setIsModalOpening(false);
    console.log('B');
    // For every wui-list-wallet name on the page. remove them if theur name!="MetaMask".
    // THIS IS AN HACK FOR WAGMI
    wallets = document.querySelectorAll('.wui-list-wallet');
    wallets.forEach((wallet) => {
      if (wallet.getAttribute('name') !== 'MetaMask') {
        wallet.remove();
      }
    });
    console.log(wallets);
    mixpanel.logEvent(mixpanel.EventTypes.WALLET_CONNECT, { Source: source, Status: 'Started' });
    isConnectionStarted.current = true;
  }, [ open, source ]);

  const handleAccountConnected = React.useCallback(({ isReconnected }: { isReconnected: boolean }) => {
    !isReconnected && isConnectionStarted.current &&
      mixpanel.logEvent(mixpanel.EventTypes.WALLET_CONNECT, { Source: source, Status: 'Connected' });
    isConnectionStarted.current = false;
  }, [ source ]);

  const handleDisconnect = React.useCallback(() => {
    disconnect();
  }, [ disconnect ]);

  useAccountEffect({ onConnect: handleAccountConnected });

  const { address, isDisconnected } = useAccount();

  const isWalletConnected = isClientLoaded && !isDisconnected && address !== undefined;

  return {
    isWalletConnected,
    address: address || '',
    connect: handleConnect,
    disconnect: handleDisconnect,
    isModalOpening,
    isModalOpen: isOpen,
  };
}
