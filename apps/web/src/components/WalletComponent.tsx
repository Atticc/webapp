import { Button, Grid, Stack, Menu, MenuItem, useTheme, CircularProgress } from '@mui/material'
import useWallet from '@utils/useWallet'
import { useRouter } from 'next/router'
import { useCallback, useState, MouseEvent, useEffect } from 'react'
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded'
import ProfileImage from './users/Avatar'
import { getProfile, registerUser } from '@req/atticc/users'
import useXmtp from '@utils/useXmtp'

export function WalletComponent() {
  const router = useRouter()
  const colorTheme = useTheme().palette
  const { connect, disconnect, address, lookupAddress, getAvatarUrl } = useWallet()
  const { connect: connectXmtp, disconnect: disconnectXmtp, client } = useXmtp()
  const [loading, setLoading] = useState(false)

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const connectWallet = useCallback(async () => {
    try {
      setLoading(true)
      const signer = await connect()
      const addr = await signer?.getAddress()
      if (addr) {
        const data = await getProfile({ address: addr as string })
        if (!data?.address) {
          const domain = await lookupAddress(addr)
          const avatar = await getAvatarUrl(addr)
          await registerUser({ address: addr as string, domain, avatar })
        }
        await connectXmtp(signer!)
      }
    } catch (_) {
    } finally {
      setLoading(false)
    }
  }, [connect])

  const handleDisconnect = useCallback(async () => {
    await disconnect()
    handleClose()
  }, [disconnect])

  const gotoProfile = (e: MouseEvent) => {
    e.preventDefault()
    router.push(`/users/${address}`)
    handleClose()
  }

  return loading ? (
    <CircularProgress />
  ) : (
    <Grid item>
      {!address ? (
        <Button variant="outline" onClick={connectWallet} endIcon={<ArrowForwardIosRoundedIcon />}>
          {loading ? 'Loading...' : 'Connect Wallet'}
        </Button>
      ) : (
        <Button
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          <Stack direction={'row'} alignItems={'center'}>
            <ProfileImage address={String(address)} />
          </Stack>
        </Button>
      )}
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={gotoProfile}>Profile</MenuItem>
        <MenuItem onClick={handleDisconnect} style={{ color: colorTheme.error.main }}>
          Logout
        </MenuItem>
      </Menu>
    </Grid>
  )
}

export default WalletComponent
