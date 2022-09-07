import type { NextPage } from 'next'
import LayoutWithoutFooter from '../../components/layouts/LayoutWithoutFooter'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useState } from 'react'
import { Button, Grid, Typography, useTheme } from '@mui/material'
import { CommunityCard } from '../../components/CommunityCard'
import CommunityCreateModal from '../../components/modal/CommunityCreateModal'

const Home: NextPage = () => {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const handleCloseCreateModal = () => setShowCreateModal(false)
  const colorTheme = useTheme().palette

  return (
    <LayoutWithoutFooter>
      <Grid container spacing={3} direction={'row'} sx={{ paddingX: 4, marginY: 4 }}>
        <Grid item xs={2}>
          <Grid container direction={'column'} spacing={2} alignItems={'center'}>
            <Grid item xs>
              <Button variant="outline" onClick={() => setShowCreateModal(true)}>
                {'Create Community'}
              </Button>
            </Grid>
          </Grid>
        </Grid>

        {/* <Grid item xs={10}>
          <Grid container direction={'column'} spacing={2}>
            <Grid item>
              <Typography variant={'h3'}>My Communities</Typography>
            </Grid>
            <Grid container direction={'row'}>
              {communities.map((c: ICommunity) => (
                <CommunityCard community={c} key={c.id} />
              ))}
            </Grid>
            <Grid item>
              <Typography variant={'h3'}>Explore Communities</Typography>
            </Grid>
            <Grid container direction={'row'}>
              {communities.map((c: ICommunity) => (
                <CommunityCard community={c} key={c.id} />
              ))}
            </Grid>
          </Grid>
        </Grid> */}
      </Grid>
      <CommunityCreateModal open={showCreateModal} onClose={handleCloseCreateModal} />
    </LayoutWithoutFooter>
  )
}

export default Home

// export const getStaticProps = async ({ locale }: { locale: string }) => ({
//   props: {
//     ...(await serverSideTranslations(locale, ['common'])),
//   },
// })
