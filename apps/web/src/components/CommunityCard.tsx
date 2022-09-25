import { Grid, Typography, useTheme } from '@mui/material'
import Link from 'next/link'
import { ICommunity } from '../app/constants'

// comminity card to show details of community page
export const CommunityCard = ({ community }: { community: ICommunity }) => {
  const colorTheme = useTheme().palette

  return (
    <Link href={`/communities/${community.id}`}>
      <Grid
        item
        sx={{
          borderRadius: 3,
          border: 0.2,
          paddingX: 2,
          paddingY: 4,
          marginX: 2,
          marginY: 1,
          cursor: 'pointer',
        }}
      >
        <Grid container direction={'column'}>
          <Typography variant="h5">{community.title}</Typography>
        </Grid>
      </Grid>
    </Link>
  )
}
