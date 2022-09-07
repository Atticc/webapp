import type { GetServerSideProps, NextPage } from 'next'
import LayoutWithoutFooter from '../../components/layouts/LayoutWithoutFooter'
import { useState } from 'react'
import { Button, Grid, Tab, Tabs, Typography } from '@mui/material'
import CommunityCreateModal from '../../components/modal/CommunityCreateModal'
import { posts } from '../../app/constants'
import { PostListItem } from '../../components/posts/PostListItem'
import { CommunitiesList } from '../../components/posts/CommunitiesList'
import { ContributorsList } from '../../components/ContributorsList'

interface UserDetailProps {
  id: string
}

const tabs = [
  { label: 'Popular', value: 1 },
  { label: 'Latests', value: 2 },
]

const Home: NextPage<UserDetailProps> = ({ id }) => {
  const [tab, setTab] = useState(1)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const handleCloseCreateModal = () => setShowCreateModal(false)

  const handleSetTab = (_: React.ChangeEvent<{}>, value: number) => {
    setTab(value)
  }
  return (
    <LayoutWithoutFooter>
      <Grid container spacing={3} direction={'row'} sx={{ paddingX: 4 }}>
        <Grid item xs>
          <Grid container direction={'column'} alignItems={'center'}>
            <Grid item xs>
              <Button variant="outline" onClick={() => setShowCreateModal(true)}>
                {'Create Community'}
              </Button>
            </Grid>
            <Grid item xs>
              <Button variant="outline" onClick={() => setShowCreateModal(true)}>
                {'Create Post'}
              </Button>
            </Grid>
            <CommunitiesList title={'Channels'} data={[]} />
            <CommunitiesList title={'Toolkits'} data={[]} />
          </Grid>
        </Grid>

        <Grid item xs={6}>
          <Tabs value={tab} onChange={handleSetTab} aria-label="Post Tabs" variant="fullWidth">
            {tabs.map((t) => (
              <Tab label={t.label} value={t.value} key={t.label} />
            ))}
          </Tabs>
          <Grid container direction={'column'} alignItems={'center'}>
            {posts.map((p) => (
              <PostListItem key={p.id} post={p} />
            ))}
          </Grid>
        </Grid>
        <Grid item xs>
          <Grid container direction={'column'}>
            <Grid item sx={{ paddingTop: 2 }}>
              <Typography variant={'h3'}>Community</Typography>
            </Grid>
            <CommunitiesList title={'Utility NFTs'} data={[]} />
            {/* <ContributorsList title={'Top Contributors'} data={users} /> */}
          </Grid>
        </Grid>
      </Grid>

      <CommunityCreateModal open={showCreateModal} onClose={handleCloseCreateModal} />
    </LayoutWithoutFooter>
  )
}

export default Home

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const { id } = context.query

//   return {
//     props: { id },
//   }
// }
