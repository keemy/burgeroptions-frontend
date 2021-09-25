import { useRouter } from 'next/router';
import Image from 'next/image';
import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/icons/Menu';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import NoSsr from '@material-ui/core/NoSsr';

import WalletStatus from './WalletStatus';
import NetworkMenu from './NetworkMenu';

import theme from '../utils/theme';
import logo from '../../public/psyoptions-logo-light.png';

import useConnection from '../hooks/useConnection';
import { isTrue } from '../utils/general';

const { NEXT_PUBLIC_INITIALIZE_PAGE_ENABLED } = process.env;

const NavOptions: React.VFC = () => {
  const router = useRouter();
  const { endpoint } = useConnection();

  return (
    <>
      <Box mx={2}>
        <Button
          href="/"
          onClick={(e) => {
            e.preventDefault();
            router.push('/');
          }}
          style={{ minWidth: 0, padding: 0 }}
        >
          <Image src={logo} width="32" height="32" alt="PsyOptions Logo" />
        </Button>
      </Box>
      <Box mx={2}>
        <Button
          href="/markets"
          onClick={(e) => {
            e.preventDefault();
            router.push('/markets');
          }}
        >
          Markets
        </Button>
      </Box>
      <Box mx={2}>
        <Button
          href="/simple/choose-asset"
          onClick={(e) => {
            e.preventDefault();
            router.push('/simple/choose-asset');
          }}
        >
          Beginner UI
        </Button>
      </Box>
      {isTrue(NEXT_PUBLIC_INITIALIZE_PAGE_ENABLED ?? false) && (
        <Box mx={2}>
          <Button
            href="/initialize-market"
            onClick={(e) => {
              e.preventDefault();
              router.push('/initialize-market');
            }}
          >
            Initialize
          </Button>
        </Box>
      )}
      <Box mx={2}>
        <Button
          href="/portfolio"
          onClick={(e) => {
            e.preventDefault();
            router.push('/portfolio');
          }}
        >
          Portfolio
        </Button>
      </Box>
      {endpoint?.name === 'Devnet' && (
        <Box mx={2}>
          <Button
            href="/faucets"
            onClick={(e) => {
              e.preventDefault();
              router.push('/faucets');
            }}
          >
            Faucets
          </Button>
        </Box>
      )}
      <Box mx={2}>
        <Button
          href="https://docs.psyoptions.io/"
          onClick={() => {}}
          style={{ minWidth: 0 }}
          target="_blank"
          rel="noopener"
        >
          Docs
        </Button>
      </Box>
    </>
  );
};

const StatusBar: React.VFC<{ transparent?: boolean }> = ({
  transparent = false,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <Hidden mdUp>
        <SwipeableDrawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onOpen={() => setDrawerOpen(true)}
        >
          <Box pt={6}>
            <NavOptions />
          </Box>
        </SwipeableDrawer>
      </Hidden>
      <Box
        px={2}
        py={1}
        display="flex"
        justifyContent="space-between"
        flexDirection="row"
        style={{
          background: transparent
            ? 'transparent'
            : theme.gradients?.secondaryPrimary,
        }}
      >
        <Box display="flex">
          <Hidden smDown>
            <NavOptions />
          </Hidden>
          <Hidden mdUp>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              style={{ padding: '4px 8px' }}
              onClick={() => setDrawerOpen(true)}
            >
              <Menu />
            </IconButton>
          </Hidden>
        </Box>
        <Box display="flex">
          <WalletStatus />
          <NoSsr>
            <NetworkMenu />
          </NoSsr>
        </Box>
      </Box>
    </>
  );
};

export default StatusBar;
