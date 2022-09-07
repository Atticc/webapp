import { ConnectionType } from '@cyberlab/cyberconnect'
import { Button, Divider, Grid, Stack, Tooltip, Typography, useTheme } from '@mui/material'
import { Box } from '@mui/system'
import useWallet from '@utils/useWallet'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { IUser } from '../../app/constants'
import { useFollowStatus } from '../../graphql/cyberconnect/queries/getFollowStatus'
import { formatAddress, isSameAddr, toChecksumAddress } from '../../utils/helper'
import EtherscanIcon from '../icons/EtherscanIcon'
import OpenseaIcon from '../icons/OpenseaIcon'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { TwitterIcon } from '../icons/TwitterIcon'
import CopyToClipboard from '../layouts/CopyToClipboard'
import UserConnectionModal from '../modal/UserConnectionModal'
import ProfileImage from './Avatar'

export const UserCard = ({ user, isDetail = false }: { user: IUser; isDetail?: boolean }) => {
  const [showConnection, setShowConnection] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const [loading, setLoading] = useState(false)
  const { address, cyberConnect } = useWallet()

  const handleFetchFollowStatusResult = (data: any) => {
    setIsFollowing(data?.isFollowing)
  }

  const { data: followStatus, refetch: refetchFollowStatus } = useFollowStatus({
    fromAddr: address || '',
    toAddr: user.address,
    onSuccess: handleFetchFollowStatusResult,
  })
  const color = useTheme().palette

  useEffect(() => {
    if (!address) return
    if (!user?.address) return

    refetchFollowStatus()
  }, [user.address, address, refetchFollowStatus])

  const onFollow = async () => {
    try {
      setLoading(true)
      isFollowing
        ? await cyberConnect?.disconnect(user?.address, '')
        : await cyberConnect?.connect(user?.address, '', ConnectionType.FOLLOW)
      await refetchFollowStatus()
    } catch (err: any) {
      console.warn(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return null
  }

  const renderFollowing = () => (
    <Stack
      direction={'row'}
      spacing={1}
      pt={0.5}
      pb={1}
      onClick={() => setShowConnection(true)}
      sx={{
        cursor: 'pointer',
        ':hover': {
          filter: 'opacity(0.8)',
        },
      }}
    >
      <Stack direction={'row'} alignItems={'center'}>
        <Typography variant="bodyBold1">{user?.followerCount || 0}</Typography>
        <Typography pl={1} variant="bodyBold1" color={color.lightGray.main}>
          Follower
        </Typography>
      </Stack>
      <Divider orientation={'vertical'} variant={'middle'} flexItem />
      <Stack direction={'row'} alignItems={'center'}>
        <Typography variant="bodyBold1">{user?.followingCount || 0}</Typography>
        <Typography pl={1} variant="bodyBold1" color={color.lightGray.main}>
          Following
        </Typography>
      </Stack>
    </Stack>
  )

  const renderSocial = () => (
    <Grid item>
      <Stack direction={'row'} alignItems={'center'} columnGap={1}>
        {user?.twitter?.handle ? (
          <Button
            sx={{ borderRadius: '50%' }}
            variant={'icon'}
            color={'secondary'}
            component={'a'}
            href={`https://twitter.com/${user?.twitter?.handle}`}
            target="_blank"
            rel="noreferrer"
          >
            <TwitterIcon color={color.white} height={24} width={24} />
          </Button>
        ) : null}
        {user?.address ? (
          <Button
            sx={{ borderRadius: '50%' }}
            variant={'icon'}
            color={'secondary'}
            component={'a'}
            href={`https://opensea.io/${user?.address}`}
            target="_blank"
            rel="noreferrer"
          >
            <OpenseaIcon color={color.white} height={24} width={24} />
          </Button>
        ) : null}
        {user?.address ? (
          <Button
            sx={{ borderRadius: '50%' }}
            variant={'icon'}
            color={'secondary'}
            component={'a'}
            href={`https://etherscan.io/address/${user?.address}`}
            target="_blank"
            rel="noreferrer"
          >
            <EtherscanIcon color={color.white} height={24} width={24} />
          </Button>
        ) : null}
      </Stack>
    </Grid>
  )

  if (isDetail) {
    return (
      <Grid
        container
        direction={'row'}
        justifyContent={'space-between'}
        bgcolor={color.white.main}
        borderRadius={4}
        px={4}
        pt={4}
        pb={5}
      >
        <Grid item>
          <Grid container direction={'row'}>
            <Grid item>
              <ProfileImage
                sx={{ height: 140, width: 140 }}
                src={user?.avatar || user?.twitter?.avatar || undefined}
                address={user?.address}
              />
            </Grid>
            <Grid item>
              <UserConnectionModal
                address={user.address}
                open={showConnection}
                onClose={() => setShowConnection(false)}
              />
              <Stack direction={'column'} pl={2} display={'flex'} justifyContent={'center'}>
                <Stack direction={'column'}>
                  <Typography variant="h4">{user?.domain || null}</Typography>
                  <CopyToClipboard>
                    {({ copy }) => (
                      <Button onClick={() => copy(user?.address)} sx={{ p: 0, width: 'fit-content' }} component={'div'}>
                        <ContentCopyIcon fontSize="small" />
                        <Typography variant="bodyBold1" pl={1} color={color.lightGray.main}>
                          {formatAddress(user?.address)}
                        </Typography>
                      </Button>
                    )}
                  </CopyToClipboard>
                </Stack>
                {renderFollowing()}
                <Stack direction={'row'} spacing={1}>
                  {address && !isSameAddr(address, user.address) ? (
                    <Button
                      variant={isFollowing ? 'outline' : 'fill'}
                      color={isFollowing ? 'secondary' : 'primary'}
                      onClick={onFollow}
                    >
                      {loading ? 'loading...' : isFollowing ? 'Followed' : 'Follow'}
                    </Button>
                  ) : null}
                  {isSameAddr(address as string, user.address) ? (
                    <Tooltip title={'Coming soon'}>
                      <Button variant={'outline'} color={'secondary'} onClick={() => {}}>
                        {'Edit Profile'}
                      </Button>
                    </Tooltip>
                  ) : null}
                  {address && !isSameAddr(address, user.address) ? (
                    <Link passHref href={`/chats/${toChecksumAddress(user?.address)}`}>
                      <Button variant="fill" component={'a'}>
                        {'Message'}
                      </Button>
                    </Link>
                  ) : null}
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Grid>
        {renderSocial()}
      </Grid>
    )
  }

  return (
    <Grid
      item
      sx={{
        borderRadius: 3,
        border: 0.5,
        paddingX: 2,
        paddingY: 3,
        cursor: 'pointer',
        height: 200,
        width: 320,
      }}
    >
      <Link href={`/users/${user.address}`}>
        <Stack direction={'column'} alignItems={'center'}>
          <Stack direction={'row'} alignItems={'center'} paddingBottom={2}>
            <ProfileImage src={user?.avatar || user?.twitter?.avatar || undefined} address={user?.address} />
            <Stack direction={'column'} paddingLeft={1}>
              <Typography variant="h5">{user?.domain || null}</Typography>
              <Typography variant="body1">{formatAddress(user?.address)}</Typography>
            </Stack>
          </Stack>
          <Stack
            direction={'row'}
            spacing={3}
            onClick={() => setShowConnection(true)}
            sx={{
              cursor: 'pointer',
              ':hover': {
                filter: 'opacity(0.8)',
              },
            }}
          >
            <Stack direction={'column'} alignItems={'center'}>
              <Typography variant="body1">Follower</Typography>
              <Typography variant="h6">{user?.followerCount || 0}</Typography>
            </Stack>
          </Stack>
          <Stack>
            <Typography variant="body2">{user?.recommendationReason}</Typography>
          </Stack>
        </Stack>
      </Link>
    </Grid>
  )
}
