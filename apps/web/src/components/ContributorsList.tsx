import { CircularProgress, Divider, Grid, Stack, Typography, useTheme } from '@mui/material'
import { IUser } from '../app/constants'
import { ContributorListItem } from './ContributorListItem'

export const ContributorsList = ({
  title,
  data,
  showReason = false,
}: {
  title?: string
  data: Array<IUser>
  showReason?: boolean
}) => {
  const color = useTheme().palette

  return (
    <Grid
      container
      direction={'column'}
      sx={{ borderRadius: 4, paddingX: 3.5, paddingY: 4 }}
      bgcolor={color.white.main}
    >
      <Grid item>
        <Typography marginBottom={1} variant="h5">
          {title}
        </Typography>
        {title ? <Divider /> : null}
      </Grid>
      {!data.length ? (
        <Stack pt={5} direction={'column'} alignItems={'center'}>
          <CircularProgress />
        </Stack>
      ) : null}
      {data?.map((u) => (
        <ContributorListItem user={u} key={u.address} showReason={showReason} />
      ))}
    </Grid>
  )
}
