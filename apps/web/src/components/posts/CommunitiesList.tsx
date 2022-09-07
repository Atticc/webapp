import { Divider, Grid, Typography, useTheme } from '@mui/material'
import Link from 'next/link'
import { ICommunity } from '../../app/constants'

export const CommunitiesList = ({ title, data }: { title?: string; data: Array<ICommunity> }) => {
  const colorTheme = useTheme().palette

  return (
    <Grid container direction={'column'} sx={{ border: 1, borderRadius: 2, paddingX: 1, paddingY: 1 }}>
      <Grid item>
        <Typography marginBottom={1} variant="h5">
          {title}
        </Typography>
        {title ? <Divider /> : null}
      </Grid>
      {data.map((c) => (
        <Link href={`/communities/${c.id}`} key={c.id}>
          <Grid
            item
            sx={{
              paddingY: 1,
              cursor: 'pointer',
              ':hover': {
                color: colorTheme.secondary.main,
              },
            }}
          >
            <Typography variant="body1">{c.title}</Typography>
          </Grid>
        </Link>
      ))}
    </Grid>
  )
}
