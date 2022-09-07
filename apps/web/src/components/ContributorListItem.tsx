import { Avatar, Grid, Stack, Typography, useTheme } from '@mui/material'
import Link from 'next/link'
import { IUser } from '../app/constants'
import { formatAddress } from '../utils/helper'
import ProfileImage from './users/Avatar'

export const ContributorListItem = ({
  user,
  showReason = false,
}: {
  user: IUser | undefined
  showReason?: boolean
}) => {
  const color = useTheme().palette

  if (!user) {
    return null
  }

  return (
    <Link href={`/users/${user.address}`}>
      <a>
        <Grid
          item
          sx={{
            borderRadius: 4,
            bgcolor: color.white.main,
            margin: 1,
            cursor: 'pointer',
            ':hover': {
              filter: 'opacity(0.8)',
            },
          }}
        >
          <Stack direction={'row'} alignItems={'center'}>
            <ProfileImage src={user?.avatar || user?.twitter?.avatar} address={user?.address} />
            <Stack direction={'column'} paddingLeft={1}>
              <Typography variant="h6">{user?.domain || null}</Typography>
              <Typography variant="body1">{formatAddress(user?.address)}</Typography>
            </Stack>
          </Stack>
          {showReason ? <Typography variant="body2">{user?.recommendationReason}</Typography> : null}
        </Grid>
      </a>
    </Link>
  )
}
