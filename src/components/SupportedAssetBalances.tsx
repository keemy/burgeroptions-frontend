import React from 'react';
import Box from '@material-ui/core/Box';
import Avatar from '@material-ui/core/Avatar';
import { useTheme } from '@material-ui/core/styles';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

import useWallet from '../hooks/useWallet';
import useAssetList from '../hooks/useAssetList';
import useOwnedTokenAccounts from '../hooks/useOwnedTokenAccounts';

import { WRAPPED_SOL_ADDRESS, getHighestAccount } from '../utils/token';

const SupportedAssetBalances: React.FC = () => {
  const theme = useTheme();
  const { balance, connected } = useWallet();
  const { supportedAssets, assetListLoading } = useAssetList();
  const { ownedTokenAccounts, loadingOwnedTokenAccounts } =
    useOwnedTokenAccounts();

  const supportedAssetAccounts = supportedAssets.map((asset) => {
    return {
      asset,
      accounts: ownedTokenAccounts[asset?.mintAddress] || [],
    };
  });

  const balances = supportedAssetAccounts.map(({ asset, accounts }) => {
    let assetBalance =
      (getHighestAccount(accounts)?.amount || 0) / 10 ** asset?.decimals;
    if (asset?.mintAddress === WRAPPED_SOL_ADDRESS) {
      // if asset is wrapped Sol, use balance of wallet account
      assetBalance = balance / LAMPORTS_PER_SOL;
    }
    return {
      asset,
      assetBalance,
    };
  });

  if (!loadingOwnedTokenAccounts && !assetListLoading && connected) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        fontSize={'14px'}
        px={2}
        pt={2}
        pb={1}
        bgcolor={theme.palette.background.medium}
      >
        <Box
          px={[1, 1, 0]}
          pb={1}
          style={{ fontWeight: 700, fontSize: '16px' }}
        >
          Wallet Balances
        </Box>
        <Box
          display="flex"
          px={[1, 1, 0]}
          flexWrap="wrap"
          flexDirection={['column', 'row']}
        >
          {balances.map(({ asset, assetBalance }) => (
            <Box
              display="flex"
              flexDirection={'row'}
              alignItems="center"
              mr={2}
              pb={1}
              key={asset?.tokenSymbol}
            >
              <Avatar
                style={{ width: '24px', height: '24px', marginRight: '8px' }}
                src={asset?.icon}
              />{' '}
              {assetBalance.toFixed(2)} {asset?.tokenSymbol}
            </Box>
          ))}
        </Box>
      </Box>
    );
  }

  return null;
};

export default SupportedAssetBalances;
