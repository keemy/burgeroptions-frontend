import { Box, Paper } from '@material-ui/core'
import React from 'react'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import { makeStyles } from '@material-ui/core/styles'
import theme from '../../../utils/theme'
import Page from '../Page'

import PositionRow from './PositionRow'
import useOpenPositions from '../../../hooks/useOpenPositions'
import useOptionsMarkets from '../../../hooks/useOptionsMarkets'

const darkBorder = `1px solid ${theme.palette.background.main}`

// add new columns here
const columns = [
  { id: 'assetPair', label: 'Asset Pair', minWidth: 170, width: '20%' },
  { id: 'strike', label: 'Strike', minWidth: 170, width: '15%' },
  { id: 'markprice', label: 'Mark Price', minWidth: 100, width: '15%' },
  {
    id: 'size',
    label: 'Size',
    minWidth: 100,
    format: (value) => value.toLocaleString('en-US'),
    width: '15%',
  },
  {
    id: 'expiration',
    label: 'Expiration',
    minWidth: 170,
    format: (value) => {
      const date = new Date(value * 1000)
      return date.toUTCString()
    },
    width: '20%',
  },
  {
    id: 'action',
    label: 'Action',
    minWidth: 170,
    align: 'right',
    width: '15%',
  },
]

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 440,
  },
})

const OpenPositions = () => {
  const classes = useStyles()
  const [page] = React.useState(0)
  const [rowsPerPage] = React.useState(10)
  const positions = useOpenPositions()
  const { markets } = useOptionsMarkets()

  const positionRows = Object.keys(positions).map((key) => ({
    accounts: positions[key],
    assetPair: `${markets[key]?.uAssetSymbol}${markets[key]?.qAssetSymbol}`,
    expiration: markets[key]?.expiration,
    markprice: 'TODO',
    size: positions[key]?.reduce(
      (acc, tokenAccount) => acc + tokenAccount.amount,
      0,
    ),
    strike: markets[key]?.strikePrice,
    optionMarketKey: markets[key]?.optionMarketDataAddress,
    quoteAssetKey: markets[key]?.qAssetMint,
    underlyingAssetKey: markets[key]?.uAssetMint,
    optionContractTokenKey: markets[key]?.optionMintAddress,
  }))

  return (
    <Page>
      <Box
        display="flex"
        justifyContent="center"
        flexDirection="column"
        height="100%"
        minHeight="500px"
        pb={4}
      >
        <Paper
          style={{
            width: '100%',
            // maxWidth: '500px',
          }}
        >
          <Box>
            <Box p={2} textAlign="center" borderBottom={darkBorder}>
              <h2 style={{ margin: '10px 0 0' }}>Open Positions</h2>
            </Box>

            <TableContainer className={classes.container}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {positionRows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <PositionRow
                        key={row.optionContractTokenKey}
                        columns={columns}
                        row={row}
                      />
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Paper>
      </Box>
    </Page>
  )
}

export default OpenPositions