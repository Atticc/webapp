import type { GetServerSideProps, NextPage } from 'next'
import LayoutWithoutFooter from '@c/layouts/LayoutWithoutFooter'
import { useEffect, useState } from 'react'
import { CircularProgress, Grid, Stack, Tab, Tabs, Typography, useTheme } from '@mui/material'
import { IPost, IUser } from '@app/constants'
import { PostListItem } from '@c/posts/PostListItem'
import { UserCard } from '@c/users/UserCard'
import { getIdentity, useIdentity } from '@req/cyberconnect/queries/getIdentity'
import { formatAddress, isValidAddr, toChecksumAddress } from '@utils/helper'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import { APP_NAME } from '@/app/config'
import { useRouter } from 'next/router'
import { TabPanel } from '@c/tabs/TabPanel'
import PostInput from '@c/posts/PostInput'
import useWallet from '@utils/useWallet'
import { Box } from '@mui/system'
import { usePosts } from '@req/atticc/posts'

const NftSection = dynamic(() => import('@c/NFT/NftSection'), {
  suspense: false,
  ssr: false,
})

interface UserDetailProps {
  address: string
  userData: IUser
  title: string
}

const tabs = [
  { label: 'Posts', value: 1 },
  { label: 'Collections', value: 2 },
]

const UserDetailPage: NextPage = () => {
  const router = useRouter()
  const { address } = router.query
  const { address: authedAddress } = useWallet()
  const {
    data: posts = [],
    refetch: refetchPosts,
    isLoading,
    isFetching,
  } = usePosts({ addresses: [toChecksumAddress(address as string)] })
  const userData: IUser = { address: String(address) }
  const [tab, setTab] = useState(1)
  const colorTheme = useTheme().palette
  const { data: user, refetch } = useIdentity({ address: toChecksumAddress(address as string), data: userData })
  const title = `${userData?.domain || formatAddress(String(address))} - ${APP_NAME} Profile`

  useEffect(() => {
    if (isValidAddr(String(address))) {
      refetch()
      refetchPosts()
    }
  }, [address, refetch, refetchPosts])

  const handleSetTab = (_: React.ChangeEvent<{}>, value: number) => {
    setTab(value)
  }

  return (
    <LayoutWithoutFooter>
      <Head>
        <title key="title">{title}</title>
        <meta property="og:title" content={title} key="og-title" />
        <meta name="twitter:title" content={title} key="tw-title" />
      </Head>

      <Grid container direction={'column'} px={10} mt={2} display={'flex'}>
        <Grid item width={1}>
          <UserCard user={user} isDetail key={`user-${address}`} />
        </Grid>
        <Grid item width={1}>
          <Tabs value={tab} onChange={handleSetTab} aria-label="Post Tabs" sx={{ py: 4 }}>
            {tabs.map((t) => (
              <Tab label={t.label} value={t.value} key={t.label} sx={{ mr: 3 }} />
            ))}
          </Tabs>
          <TabPanel value={tab} index={1}>
            <Grid container direction={'column'} alignItems={'center'}>
              {authedAddress === address ? (
                <Grid item width={'100%'} pb={2}>
                  <PostInput
                    onSend={async () => {
                      await refetchPosts()
                    }}
                    authedAddress={String(authedAddress)}
                    key={authedAddress}
                  />
                </Grid>
              ) : null}
              {isLoading || isFetching ? (
                <CircularProgress size={80} />
              ) : !posts?.length ? (
                <Stack direction="column" alignItems={'center'}>
                  <Typography variant="h4">No Posts yet</Typography>
                  <Typography variant="body1">{`This person haven't post anything in awhile...`}</Typography>
                </Stack>
              ) : null}
              {posts?.map((p: IPost) => (
                <Grid item width={'100%'} py={2} key={p.id}>
                  <PostListItem post={p} />
                </Grid>
              ))}
            </Grid>
          </TabPanel>
          <TabPanel value={tab} index={2}>
            <NftSection address={String(address)} key={`nft-${address}`} />
          </TabPanel>
          <Box py={5} />
        </Grid>
      </Grid>
    </LayoutWithoutFooter>
  )
}

export default UserDetailPage

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const { address } = context.query
//   let userData: any = {}

//   try {
//     if (isValidAddr(String(address))) {
//       userData = await getIdentity(String(address))
//     } else {
//       throw new Error('ERR_WALLET_ADDRESS_PATH_INCORRECT')
//     }
//   } catch (err: any) {
//     console.warn(err.message)
//     return {
//       notFound: true,
//     }
//   }

//   if (!userData?.address) {
//     return {
//       notFound: true,
//     }
//   }

//   return {
//     props: { address, userData, title: `${userData?.domain || formatAddress(String(address))} - ${APP_NAME} Profile` },
//   }
// }
