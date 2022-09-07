import type { GetServerSideProps, NextPage } from 'next'
import LayoutWithoutFooter from '../../../../components/layouts/LayoutWithoutFooter'
import { Grid, Typography } from '@mui/material'

interface UserDetailProps {
  pageId: string
  id: string
}

const Home: NextPage = () => {
  return (
    <LayoutWithoutFooter>
      <Grid container spacing={3} direction={'row'} sx={{ paddingX: 4 }}>
        <Grid item direction={'column'} xs>
          {/* <Typography variant={'h2'}>
            Community {id}, Post {pageId}
          </Typography> */}
          <Typography variant={'h2'}>Community - Posts</Typography>
        </Grid>
      </Grid>
    </LayoutWithoutFooter>
  )
}

export default Home

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const { pageId, id } = context.query

//   return {
//     props: { pageId, id },
//   }
// }
