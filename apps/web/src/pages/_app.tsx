import Head from 'next/head'
import { AppProps } from 'next/app'
import CssBaseline from '@mui/material/CssBaseline'
import { CacheProvider, EmotionCache } from '@emotion/react'
import createEmotionCache from '@app/createEmotionCache'
import dynamic from 'next/dynamic'
import { APP_NAME } from '@app/config'
import './styles.css'

import { appWithTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

const AppWithoutSSR = dynamic(() => import('@c/layouts/App'), {
  ssr: false,
})

const title = `${APP_NAME} - For Crypto Communities`
const description = `We are crypto and NFT enthusiasts with diverse professional backgrounds. We came together for a shared vision - building the best crypto native social media platform for the communities we love.`

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache
}

function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props
  const HOSTNAME = process.env.NEXT_PUBLIC_HOSTNAME

  const router = useRouter()
  const path = (/#!(\/.*)$/.exec(router.asPath) || [])[1]
  if (path) {
    router.replace(path)
  }

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <title key="title">{title}</title>
        <meta property="description" content={description} key="description" />
        <meta property="og:title" content={title} key="og-title" />
        <meta property="og:description" content={description} key="og-description" />
        <meta property="og:image" content={`${HOSTNAME}/assets/atticc.png`} key="og-image" />
        <meta name="twitter:title" content={title} key="tw-title" />
        <meta name="twitter:description" content={description} key="tw-description" />
        <meta name="twitter:image" content={`${HOSTNAME}/assets/atticc.png`} key="tw-image" />
        <meta name="twitter:card" content="summary_large_image" key="tw-card" />
      </Head>
      <AppWithoutSSR>
        <CssBaseline />
        <Component {...pageProps} />
      </AppWithoutSSR>
    </CacheProvider>
  )
}

export default appWithTranslation(MyApp)
