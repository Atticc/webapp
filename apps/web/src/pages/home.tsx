import type { NextPage } from 'next'
import LayoutWithoutFooter from '../components/layouts/LayoutWithoutFooter'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useEffect, useState } from 'react'
import { Grid, Tab, Tabs, useTheme } from '@mui/material'
import { IPost, IUser } from '../app/constants'
import { ContributorsList } from '../components/ContributorsList'
import { PostListItem } from '../components/posts/PostListItem'
import { useRecommendation } from '../graphql/cyberconnect/queries/getRecommendation'
import { usePopular } from '../graphql/cyberconnect/queries/getPopular'
import { isValidAddr } from '../utils/helper'
import useWallet from '@utils/useWallet'
import { usePosts } from '@req/atticc/posts'
import PostInput from '@c/posts/PostInput'

const tabs = [
  { label: 'Explore', value: 0 },
  { label: 'Popular', value: 1 },
  { label: 'Latests', value: 2 },
]

const Home: NextPage = () => {
  const { data: posts = [], refetch: refetchPosts, isLoading } = usePosts({})
  const { address } = useWallet()
  const handleSuccess = (data: [IUser]) => {
    setUsers(data)
  }
  const { refetch: fetchRecommendations } = useRecommendation({
    address: address || '',
    onSuccess: handleSuccess,
  })
  const { refetch: fetchPopular } = usePopular({
    first: 5,
    onSuccess: handleSuccess,
  })
  const colorTheme = useTheme().palette
  const [tab, setTab] = useState(0)
  const [users, setUsers] = useState<[IUser] | []>([])

  useEffect(() => {
    refetchPosts()
    if (isValidAddr(String(address))) {
      fetchRecommendations()
    } else {
      fetchPopular()
    }
  }, [address, fetchPopular, fetchRecommendations, refetchPosts])

  const handleSetTab = (_: React.ChangeEvent<{}>, value: number) => {
    setTab(value)
  }

  return (
    <LayoutWithoutFooter>
      <Grid container direction={'row'} sx={{ paddingX: 10 }} marginTop={2} justifyContent={'space-between'}>
        <Grid item md={8}>
          <Grid container direction={'column'}>
            {/* <Tabs value={tab} onChange={handleSetTab} aria-label="Post Tabs" variant="fullWidth">
              {tabs.map((t) => (
                <Tab label={t.label} value={t.value} key={t.label} />
              ))}
            </Tabs> */}
            <PostInput
              authedAddress={address as string}
              onSend={async () => {
                await refetchPosts()
              }}
              line={2}
            />
            {posts?.map((p: IPost) => (
              <Grid item width={'100%'} py={2} key={p.id}>
                <PostListItem post={p} />
              </Grid>
            ))}
            <Grid item height={50} />
          </Grid>
        </Grid>
        <Grid item md={4} pl={2}>
          <Grid container direction={'column'}>
            <ContributorsList title={'Recommendations'} data={users} showReason />
          </Grid>
        </Grid>
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
