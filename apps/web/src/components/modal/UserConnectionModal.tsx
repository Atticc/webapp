import { Box, Divider, Modal, Stack, SxProps, Tab, Tabs, TextField, Theme, Typography, useTheme } from '@mui/material'
import { useTranslation } from 'next-i18next'
import { useEffect, useState } from 'react'
import { CloseIcon } from '../icons/ArrowIcon'
import { useConnections } from '../../graphql/cyberconnect/queries/getConnections'
import { ContributorsList } from '../ContributorsList'
import { IUser } from '../../app/constants'
import { isValidAddr } from '@utils/helper'

const defaultConnections: {
  followers: Array<IUser>
  followings: Array<IUser>
  friends: Array<IUser>
} = {
  followers: [],
  followings: [],
  friends: [],
}
const defaultCounts: {
  followers: number
  followings: number
  friends: number
} = {
  followers: 0,
  followings: 0,
  friends: 0,
}

enum FollowType {
  followers = 'followers',
  friends = 'friends',
  followings = 'followings',
}

const tabs = [
  {
    label: 'Friends',
    value: FollowType.friends,
  },
  { label: 'Followers', value: FollowType.followers },
  { label: 'Followings', value: FollowType.followings },
]

const UserConnectionModal = ({
  open,
  address,
  onClose,
}: {
  address: string
  open: boolean
  onClose: (event: {}, reason: 'backdropClick' | 'escapeKeyDown') => void
}) => {
  const [tab, setTab] = useState<FollowType>(FollowType.friends)
  const [connections, setConnections] = useState(defaultConnections)
  const [counts, setCounts] = useState(defaultCounts)

  const { t } = useTranslation()
  const colorTheme = useTheme().palette
  const { data, refetch } = useConnections({ address, first: 50 })

  useEffect(() => {
    if (data) {
      setConnections({
        followers: data?.followers?.list,
        followings: data?.followings?.list,
        friends: data?.friends?.list,
      })
      setCounts({
        followers: data?.followerCount,
        followings: data?.followingCount,
        friends: data?.friends?.list?.length,
      })
      setTab(
        data?.friends?.list?.length
          ? FollowType.friends
          : data?.followerCount
          ? FollowType.followers
          : data?.followingCount
          ? FollowType.followings
          : FollowType.friends
      )
    } else {
      setConnections(defaultConnections)
      setCounts(defaultCounts)
    }
  }, [data])

  useEffect(() => {
    if (!isValidAddr(address)) return
    refetch()
  }, [address, refetch])

  const handleSetTab = (_: React.ChangeEvent<{}>, value: FollowType) => {
    setTab(value)
  }

  return (
    <Modal
      open={open}
      onClose={(e) => {
        onClose(e, 'backdropClick')
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{
        background: colorTheme.modalbgcolor.main,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          borderRadius: '12px',
          boxShadow: 24,
          padding: '26.5px',
          border: 0.1,
          bgcolor: colorTheme.background.default,
        }}
      >
        <Box
          component={'div'}
          onClick={(e: {}) => {
            onClose(e, 'backdropClick')
          }}
          sx={{
            cursor: 'pointer',
            position: 'absolute',
            display: 'inline-flex',
            verticalAlign: 'middle',
            top: '26.5px',
            right: '26.5px',
          }}
        >
          <CloseIcon color={colorTheme.dark}></CloseIcon>
        </Box>
        <Stack>
          <Stack flexDirection="row" justifyContent={'center'} alignItems={'center'}>
            <Tabs value={tab} onChange={handleSetTab} aria-label="Post Tabs" variant="fullWidth">
              {tabs.map((t) => (
                <Tab label={`${t.label}(${counts[t.value]})`} value={t.value} key={t.label} />
              ))}
            </Tabs>
          </Stack>
          <Stack
            sx={{
              minHeight: '70vh',
              maxHeight: '70vh',
              overflowY: 'auto',
              borderRadius: '12px',
              padding: '10px 16px',
              margin: '10px 0 8px 0',
            }}
          >
            <ContributorsList data={connections[tab]} />
          </Stack>
        </Stack>
      </Box>
    </Modal>
  )
}
export default UserConnectionModal
