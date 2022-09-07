import { Nft, NftFilters, TokenBalance } from '@alch/alchemy-web3'
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material'
import numeral from 'numeral'
import { useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { IOatNft, IPoapNft } from '@app/types'
import { useOATs } from '@req/galaxy/getOATs'
import { POAP } from '@req/poap'
import { isValidAddr } from '@utils/helper'
import { useAlchemy } from '@utils/useAlchemy'
import { NftItem } from '@/components/NFT/NftItem'
import { OatItem } from '@/components/NFT/OatItem'
import { PoapItem } from '@/components/NFT/PoapItem'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
import { NODE_ENV } from '@app/config'
import TOKENS, { IToken } from '@app/token'
import useWallet from '@utils/useWallet'
import { Coingecko } from '@req/coingecko'

const TypeSection = ({
  children,
  label,
  height = 360,
}: {
  label: string
  children: Array<JSX.Element> | JSX.Element
  height?: number | string
}) => {
  const [show, setShow] = useState(false)

  return (
    <Grid item sx={{ overflowX: 'hidden' }} pb={3}>
      <Grid container direction={'row'} justifyContent={'space-between'} mb={1.5} alignItems={'center'}>
        <Grid item>
          <Typography variant="h4">{label}</Typography>
        </Grid>
        <Grid item>
          <Button variant={'icon'} color={'primary'} size={'large'} onClick={() => setShow(!show)}>
            {show ? <RemoveCircleIcon fontSize="large" /> : <AddCircleIcon fontSize="large" />}
          </Button>
        </Grid>
      </Grid>
      <Grid
        container
        maxWidth={1}
        direction={'row'}
        gap={4}
        wrap={'wrap'}
        maxHeight={show ? 'unset' : height}
        overflow={'hidden'}
        px={0.1}
        pb={1}
      >
        {children}
      </Grid>
    </Grid>
  )
}

interface ITokenResponse {
  tokenBalance: string
  contractAddress: string
}

export const NftSection = ({ address }: { address: string }) => {
  const color = useTheme().palette
  const { alchemy } = useAlchemy()
  const { getBalance } = useWallet()
  const [loading, setLoading] = useState(false)
  const [tokens, setTokens] = useState<Array<IToken>>([])
  const [nfts, setNfts] = useState<{ items: Array<Nft>; totalCount?: number }>({ items: [], totalCount: 0 })
  const { data: oats = {}, refetch: fetchOATs, isLoading: oatLoading, isFetching: oatFetching } = useOATs({ address })
  const {
    data: { data: poaps = [] } = {},
    isLoading: poapLoading,
    isFetching: poapFetching,
  } = useQuery(['poap', address], () => POAP.getNFTs({ address }))

  useEffect(() => {
    function sortPricing(a: IToken, b: IToken) {
      if (!a.amount || !b.amount) {
        return 0
      }
      if (a.amount < b.amount) {
        return 1
      }
      if (a.amount > b.amount) {
        return -1
      }
      return 0
    }

    function calBalance(token: Partial<TokenBalance>, pricing: any): IToken {
      const contract: IToken = TOKENS?.[token.contractAddress || ''] || {}
      let balance = Number(token.tokenBalance)
      balance = balance / Math.pow(10, contract?.decimals || 18)
      const basePrice = pricing[contract.coingeckoId].usd || 0
      const amount = balance * basePrice

      return { ...contract, balance: balance, basePrice: basePrice, amount: amount }
    }

    async function fetchNFTs() {
      try {
        setLoading(true)
        try {
          const { ownedNfts, totalCount } = await alchemy.getNfts({ owner: address, filters: [NftFilters.SPAM] })
          setNfts({ items: ownedNfts.filter((n) => !n?.error), totalCount: totalCount })
        } catch (_) {
          setNfts({ items: [], totalCount: 0 })
        }
        try {
          await fetchOATs()
        } catch (_) {}
        try {
          // @ts-ignore
          const { tokenBalances = [] } = await alchemy.getTokenBalances(address, 'DEFAULT_TOKENS')
          const ethBalance = await getBalance(address)
          const availablesTokens: Array<Partial<TokenBalance>> = [
            { tokenBalance: ethBalance, contractAddress: '0x0' },
            ...tokenBalances,
          ].filter((b) => b.tokenBalance !== '0' && TOKENS?.[b.contractAddress].coingeckoId)

          const ids: Array<string> = availablesTokens.reduce(
            (prev: Array<string>, cur: Partial<TokenBalance>) => [
              ...prev,
              TOKENS?.[cur?.contractAddress as string]?.coingeckoId,
            ],
            []
          )
          const { data: pricing = {} } = await Coingecko.getPrices({ ids })
          const balances: Array<IToken> = availablesTokens?.map((aval) => calBalance(aval, pricing))
          setTokens(balances.sort(sortPricing) || [])
        } catch (_) {
          setTokens([])
        }
      } catch (_) {
      } finally {
        setLoading(false)
      }
    }
    if (isValidAddr(address)) {
      fetchNFTs()
      // NODE_ENV !== 'development' && fetchNFTs()
    } else {
      setNfts({ items: [], totalCount: 0 })
    }
  }, [address])

  return (
    <Grid container direction={'column'} width={1}>
      {nfts?.items?.length > 0 ? (
        <TypeSection label={'NFTS'} height={740}>
          {nfts?.items?.map((n) => (
            <NftItem nft={n} key={n.id.tokenId} />
          ))}
        </TypeSection>
      ) : null}
      {poaps?.length > 0 ? (
        <TypeSection label={'POAPS'}>
          {poaps?.map((p: IPoapNft) => (
            <PoapItem poap={p} key={p.tokenId} />
          ))}
        </TypeSection>
      ) : null}
      {oats?.list?.length > 0 ? (
        <TypeSection label={'OATS'}>
          {oats?.list?.map((o: IOatNft) => (
            <OatItem oat={o} key={o.id} />
          ))}
        </TypeSection>
      ) : null}
      {loading || poapLoading || poapFetching || oatLoading || oatFetching ? (
        <CircularProgress size={100} color="primary" />
      ) : null}
      {tokens?.length > 0 ? (
        <TypeSection label={'TOKENS'} height={'unset'}>
          <Box bgcolor={color.white.main} borderRadius={5} width={'100%'}>
            <TableContainer component={Paper} sx={{ px: 3, py: 1, borderRadius: 5 }}>
              <Table aria-label="owned token table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography variant="h5" color={color.lightGray.main}>
                        Token
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="h5" color={color.lightGray.main}>
                        Balance
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="h5" color={color.lightGray.main}>
                        Amount
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tokens.map((row: IToken) => (
                    <TableRow key={row?.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell component="th" scope="row">
                        <Stack direction={'row'} alignItems={'center'}>
                          <Avatar
                            src={row.logo}
                            sx={{
                              height: 32,
                              width: 32,
                              '& img': {
                                objectFit: 'contain',
                              },
                            }}
                            variant={'rounded'}
                          />
                          <Typography variant="bodyBold1" pl={1}>
                            {row.name}{' '}
                            <Typography variant="body1" component={'span'}>
                              ({row.symbol})
                            </Typography>
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="bodyBold1">
                          {numeral(row.balance).format('0,0[.]0[000]')} {row.symbol}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="bodyBold1">{numeral(row.amount).format('$0,0[.]00')}</Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </TypeSection>
      ) : null}
      {!oats?.list?.length &&
      !poaps?.length &&
      !nfts?.items?.length &&
      !oatLoading &&
      !poapLoading &&
      !loading &&
      !oatFetching &&
      !poapFetching ? (
        <Stack direction="column" alignItems={'center'}>
          <Typography variant="h4">No Collection Found.</Typography>
        </Stack>
      ) : null}
    </Grid>
  )
}

export default NftSection
