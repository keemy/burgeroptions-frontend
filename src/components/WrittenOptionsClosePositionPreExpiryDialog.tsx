import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import React, { useCallback, useState } from 'react';
import { useClosePosition } from '../hooks/useClosePosition';
import { useDecimalsForMint } from '../hooks/useDecimalsForMint';
import { OptionMarket, TokenAccount } from '../types';
import { getOptionNameByMarket } from '../utils/format';
import DialogFullscreenMobile from './DialogFullscreenMobile';
import { PlusMinusIntegerInput } from './PlusMinusIntegerInput';

export const WrittenOptionsClosePositionPreExpiryDialog: React.VFC<{
  dismiss: () => void;
  numLeftToClaim: number;
  option: OptionMarket;
  optionTokenAccount: TokenAccount;
  underlyingAssetDestKey: PublicKey;
  vaultBalance: BN;
  visible: boolean;
  writerTokenAccount: TokenAccount;
}> = ({
  dismiss,
  numLeftToClaim,
  option,
  optionTokenAccount,
  underlyingAssetDestKey,
  vaultBalance,
  visible,
  writerTokenAccount,
}) => {
  const underlyingAssetDecimals = useDecimalsForMint(
    option.underlyingAssetMintKey,
  );
  const [loading, setLoading] = useState(false);
  const [size, setSize] = useState<number | null>(1);
  const closeWrittenOptionPreExpiry = useClosePosition(
    option,
    optionTokenAccount.pubKey,
    underlyingAssetDestKey,
    writerTokenAccount.pubKey,
  );
  const handleClaimUnderlying = useCallback(async () => {
    setLoading(true);
    await closeWrittenOptionPreExpiry(size ?? 1);
    setLoading(false);
    dismiss();
  }, [closeWrittenOptionPreExpiry, dismiss, size]);

  const underlyingSize =
    (size ?? 0) *
    option.amountPerContractBN.toNumber() *
    10 ** -underlyingAssetDecimals;

  const normalizedVaultBalance =
    vaultBalance.toNumber() * 10 ** -underlyingAssetDecimals;
  const max = Math.min(
    optionTokenAccount.amount,
    writerTokenAccount.amount,
    numLeftToClaim,
  );

  return (
    <DialogFullscreenMobile onClose={dismiss} maxWidth="lg" open={visible}>
      <DialogTitle>Claim {option.uAssetSymbol}</DialogTitle>
      <DialogContent>
        <Box
          display="flex"
          justifyContent="space-between"
          flexDirection={['column', 'column', 'row']}
          width={['100%', '100%', '680px']}
        >
          <Box flexDirection="column" width={['100%', '100%', '50%']}>
            {getOptionNameByMarket(option)}
            <Box pt={1}>
              Vault balance: {normalizedVaultBalance} {option.uAssetSymbol}
            </Box>
            <Box pt={1}>Writer Tokens held: {writerTokenAccount.amount}</Box>
            <Box py={1}>Option Tokens held: {optionTokenAccount.amount}</Box>
            <Divider />
            <Box pt={1}>Max redeemable: {max}</Box>
          </Box>
          <Box flexDirection="column" width={['100%', '100%', '50%']}>
            <PlusMinusIntegerInput
              max={max}
              min={1}
              onChange={setSize}
              value={size}
            />
            <Box pt={2} style={{ fontSize: 12 }}>
              {`Burn ${size} Writer Tokens and Option Tokens to claim ${underlyingSize} ${option.uAssetSymbol}`}
            </Box>
          </Box>
        </Box>
        <DialogActions>
          <Button onClick={dismiss} color="primary">
            Close
          </Button>
          <Button onClick={handleClaimUnderlying} color="primary">
            {!!loading && <CircularProgress size={24} />}
            Claim
          </Button>
        </DialogActions>
      </DialogContent>
    </DialogFullscreenMobile>
  );
};
