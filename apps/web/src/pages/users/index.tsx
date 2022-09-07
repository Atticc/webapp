import type { NextPage } from 'next'
import LayoutWithoutFooter from '../../components/layouts/LayoutWithoutFooter'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useEffect, useState } from 'react'
import { Grid, Typography, useTheme } from '@mui/material'
import { IUser } from '../../app/constants'
import { UserCard } from '../../components/users/UserCard'
import { usePopular } from '../../graphql/cyberconnect/queries/getPopular'

const Home: NextPage = () => {
  const [popularUsers, setPopularUsers] = useState<Array<IUser>>([])

  const handleSuccess = (data: [IUser]) => {
    setPopularUsers(data)
  }
  const { refetch: fetchPopular } = usePopular({
    first: 20,
    onSuccess: handleSuccess,
  })

  useEffect(() => {
    fetchPopular()
  }, [fetchPopular])

  const colorTheme = useTheme().palette
  return (
    <LayoutWithoutFooter>
      <Grid container spacing={3} direction={'column'} sx={{ paddingX: 4 }}>
        <Grid item xs>
          <Typography variant={'h2'}>Discover Users</Typography>
        </Grid>
      </Grid>
      <Grid container direction={'row'} sx={{ marginY: 3 }} rowGap={2} columnGap={2}>
        {popularUsers.map((u) => (
          <UserCard user={u} key={u.address} />
        ))}
      </Grid>
    </LayoutWithoutFooter>
  )
}

export default Home

// export const getStaticProps = async ({ locale }: { locale: string }) => ({
//   props: {
//     ...(await serverSideTranslations(locale, ['common'])),
//   },
// })
