import React, { memo, useMemo, Fragment } from 'react';
import {
  Box,
  makeStyles,
} from "@material-ui/core";
import clsx from "clsx";
import useWallet from '../../../../hooks/useWallet';
import { useWrittenOptions } from '../../../../hooks/useWrittenOptions';
import useOpenPositions from '../../../../hooks/useOpenPositions';
import useOptionsMarkets from '../../../../hooks/useOptionsMarkets';
import { Heading } from '../Heading';
import WrittenOptionRow from './WrittenOptionRow';
import EmptySvg from '../EmptySvg';

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    backgroundColor: theme.palette.background.medium,
    minHeight: "514px",
  },
  mobile: {
    fontSize: "12px !important",
  },
  noOptionsBox: {
    color: theme.palette.border.main,
  },
  headerColumns: {
    backgroundColor: theme.palette.background.paper,
    padding: "20px",
    fontSize: "14px",
  },
  emptySVGContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    padding: theme.spacing(3),
    flexGrow: 1,
  },
}));

// TODO handle the case where the writer has multiple underlying asset accounts
const WrittenOptionsTable: React.VFC<{
  className: string;
  formFactor: "desktop" | "tablet" | "mobile";
}> = ({ className, formFactor }) => {
  const classes = useStyles();
  const { connected } = useWallet();
  const positions = useOpenPositions();
  const writtenOptions = useWrittenOptions();
  const { markets } = useOptionsMarkets();
  const nowInSeconds = Date.now() / 1000;

  // TODO - Add user-configurable sort order
  // For now just sort by expiration to make sure the expired options are below the active ones
  const writtenOptionKeys = useMemo(
    () =>
      Object.keys(writtenOptions).sort((keyA, keyB) => {
        const marketA = markets[keyA];
        const marketB = markets[keyB];
        return marketB?.expiration - marketA?.expiration;
      }),
    [writtenOptions, markets],
  );

  return (
    <Box className={classes.root}>
      <Heading>Written Options</Heading>
      <Box className={clsx(
        classes.headerColumns,
        className,
        formFactor === "mobile" && classes.mobile
      )}>
        <Box pl={formFactor === "mobile" ? 2 : formFactor === "tablet" ? 6 : 0}>
          Asset
        </Box>
        {formFactor === "desktop" && <Fragment>
          <Box>
            Type
          </Box>
          <Box>
            Strike ($)
          </Box>
          <Box>
            Available
          </Box>
          <Box>
            Contract Size
          </Box>
          <Box>
            Written
          </Box>
        </Fragment>}
        <Box>
          Expiration
        </Box>
        <Box>
          Locked Assets
        </Box>
        <Box pl={formFactor === "mobile" ? 2 : 6}>
          Action
        </Box>
      </Box>
      {writtenOptionKeys.length === 0 ? (
        <Box className={classes.emptySVGContainer}>
          <EmptySvg />
          <Box className={classes.noOptionsBox}>
            {connected
              ? 'You have no written options'
              : 'Wallet not connected'}
          </Box>
        </Box>
      ) : (
        <Box>
          {writtenOptionKeys.map((marketKey) => {
            const market = markets[marketKey];
            const heldContracts = positions[marketKey]
              ? positions[marketKey].filter((position) => position.amount > 0)
              : [];
            return (
              <WrittenOptionRow
                expired={nowInSeconds > market.expiration}
                key={marketKey}
                marketKey={marketKey}
                writerTokenAccounts={writtenOptions[marketKey]}
                heldContracts={heldContracts}
                formFactor={formFactor}
                className={className}
              />
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default memo(WrittenOptionsTable);