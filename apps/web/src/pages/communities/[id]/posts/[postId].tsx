import type { GetServerSideProps, NextPage } from 'next'
import LayoutWithoutFooter from '../../../../components/layouts/LayoutWithoutFooter'
import { useState } from 'react'
import { Button, Grid, Tab, Tabs, Typography } from '@mui/material'
import { CommunitiesList } from '../../../../components/posts/CommunitiesList'
import { PostListItem } from '../../../../components/posts/PostListItem'
import { comments, IComment, posts } from '../../../../app/constants'
import { ContributorsList } from '../../../../components/ContributorsList'
import CommunityCreateModal from '../../../../components/modal/CommunityCreateModal'
import { CommentListItem } from '../../../../components/posts/CommentListItem'

interface UserDetailProps {
  postId: string
  id: string
}

const Home: NextPage = () => {
  const [tab, setTab] = useState(1)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const handleCloseCreateModal = () => setShowCreateModal(false)

  const handleSetTab = (_: React.ChangeEvent<{}>, value: number) => {
    setTab(value)
  }

  return (
    <LayoutWithoutFooter>
      <Grid container spacing={3} direction={'row'} sx={{ paddingX: 10 }} marginTop={2}>
        <Grid item xs>
          <Grid container direction={'column'} alignItems={'center'} gap={3}>
            <Grid container gap={2}>
              <Button variant="outline" onClick={() => setShowCreateModal(true)}>
                {'Create Community'}
              </Button>
              <Button variant="outline" onClick={() => setShowCreateModal(true)}>
                {'Create Post'}
              </Button>
            </Grid>
            <CommunitiesList title={'Channels'} data={[]} />
            <CommunitiesList title={'Toolkits'} data={[]} />
          </Grid>
        </Grid>

        <Grid item xs={12} md={6}>
          <Grid container direction={'column'} alignItems={'center'}>
            {/* <PostListItem post={posts.find((p) => String(p.id) === postId)} /> */}
            {comments.map((c: IComment) => (
              <CommentListItem comment={c} key={c.id} />
            ))}
          </Grid>
        </Grid>
        <Grid item xs>
          <Grid container direction={'column'} gap={3}>
            <Grid item sx={{ paddingTop: 2 }}>
              {/* <Typography variant={'h3'}>Community {id}</Typography> */}
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
//   const { postId, id } = context.query

//   return {
//     props: { postId, id },
//   }
// }
