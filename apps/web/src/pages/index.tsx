import type { NextPage } from 'next'
import { Avatar, Stack, Tooltip, Typography, Grid, Button, colors, useTheme } from '@mui/material'
import { World, Item } from 'react-dom-box2d'
import { AtticcIcon, LandingAtticIcon } from '@c/icons/AtticcIcon'
import { LANDING_PROFILES } from '@app/constants'
import Header from '@c/layouts/Header'
import { useEffect, useState } from 'react'
import { useDimensions } from '@utils/useDimensions'

const TestPage: NextPage = () => {
  const color = useTheme().palette
  const [size, setSize] = useState<number>(120)
  const { height, width } = useDimensions()

  useEffect(() => {
    setSize(Math.min(120, window.innerWidth / 6))
  }, [width])

  const renderItem = (i: any) => {
    const top = Math.max(0, Math.floor(Math.random() * 240))
    const left = Math.max(0, Math.floor(Math.random() * (window.innerWidth - 120)))

    return (
      <Item left={left} top={top} restitution={0.3} key={i.address} height={size} width={size} shape={'circle'}>
        <div style={{ height: size, width: size }}>
          {/* <Link href={`/users/${i.address}`} passHref>
            <a> */}
          <Tooltip
            followCursor
            title={
              <Stack direction={'column'}>
                <Typography variant="body1">{i?.name || i?.address}</Typography>
              </Stack>
            }
            arrow
            placement={'top'}
          >
            <Avatar
              src={i?.image}
              alt={`${i.name} profile image`}
              sx={{
                bgcolor: 'transparent',
                width: size,
                height: size,
                ':hover': {
                  filter: 'opacity(0.9)',
                  transform: 'scale(1.2)',
                  zIndex: 1000,
                },
              }}
            >
              <AtticcIcon
                tColor={'#fff'}
                oColor={'#fff'}
                borderColor={'#fff'}
                aColor={'#000'}
                cColor={'#000'}
                height={120}
                width={120}
              />
            </Avatar>
          </Tooltip>
          {/* </a>
          </Link> */}
        </div>
      </Item>
    )
  }

  const renderImage = () => (
    <World
      key={`width-${String(Math.floor(width))}&height-${String(Math.floor(height))}`}
      width={Math.floor(window.innerWidth)}
      height={Math.floor(window.innerHeight)}
      gravity={[0, 9.8]}
      style={{
        backgroundColor: 'transparent',
        position: 'absolute',
        bottom: 0,
        right: 0,
        overflowX: 'hidden',
        overflowY: 'hidden',
      }}
    >
      {LANDING_PROFILES.map(renderItem)}
    </World>
  )

  return (
    <Stack
      height={'100vh'}
      width={'100vw'}
      sx={{
        overflow: 'hidden',
        backgroundColor: '#F26E21',
      }}
    >
      {renderImage()}
      <Header showSearch={false} placeholder />
      <Grid
        container
        direction="row"
        justifyContent={'space-around'}
        height={'50vh'}
        alignItems={'center'}
        pt={10}
        px={10}
      >
        <Grid item md={8}>
          <Grid container direction="column">
            <Grid item>
              <Typography variant="h1" color={color.white.main}>
                Heyy, fant<span style={{ color: color.black.main, fontWeight: 600 }}>A</span>s
                <span style={{ color: color.black.main, fontWeight: 600 }}>TTICC</span> day!
              </Typography>
              <Typography variant="body1" pt={2} color={color.white.main}>
                Welcome to a crypto native social media, built by crypto nerds, for crypto lovers, with{' '}
                <span style={{ color: color.white.main, fontWeight: 600 }}>❤️</span>
                <br />
                Find your community, chill with frens, experience web3. LFG!
              </Typography>
            </Grid>
            <Grid item pt={2}>
              <Button variant="outline" color="primary" href={'https://twitter.com/atticc_xyz'}>
                Contact Us
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={4}>
          <LandingAtticIcon />
        </Grid>
      </Grid>
    </Stack>
  )
}

export default TestPage
