import { Nft } from '@alch/alchemy-web3'
import { Avatar, Card, CardContent, CardMedia, CircularProgress, Stack, Tooltip, Typography } from '@mui/material'
import { useState } from 'react'
import { decodeNftTokenUri, replaceIPFS } from '@utils/helper'
import { useEffect } from 'react'

export const NftItem = ({
  nft,
  height = 276,
  width = 262,
}: {
  nft: Nft | undefined
  height?: number
  width?: number
}) => {
  const [show, setShow] = useState(true)
  const [loading, setLoading] = useState(true)
  const [id, setId] = useState<number | undefined>(undefined)
  const [item] = useState(() => {
    return {
      ...nft,
      metadata: !nft?.metadata?.name ? decodeNftTokenUri(nft?.tokenUri?.raw) : nft?.metadata,
    }
  })

  useEffect(() => {
    setId(parseInt(item?.id?.tokenId || '0x0', 16))
  }, [item])

  useEffect(() => {
    const loaderTimer = setTimeout(() => {
      if (loading === true) {
        setShow(false)
      }
    }, 10_000)

    return () => {
      clearTimeout(loaderTimer)
    }
  }, [loading])

  const handleError = () => {
    setShow(false)
  }

  const handleLoad = () => {
    setLoading(false)
  }

  if (!nft) {
    return null
  }

  return show ? (
    <Card sx={{ maxWidth: width, width: width, borderRadius: '20px' }}>
      <CardMedia
        // sx={{objectFit: 'contain'}}
        component="img"
        height={height}
        image={replaceIPFS(item?.media?.[0]?.gateway || item?.metadata?.image || item?.metadata?.image_url)}
        alt={item?.title || item?.metadata?.name}
        onError={handleError}
        onLoad={handleLoad}
      />
      <CardContent sx={{ px: 4 }}>
        <Typography
          variant="bodyBold1"
          textAlign={'center'}
          textOverflow={'ellipsis'}
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: '2',
            WebkitBoxOrient: 'vertical',
            wordBreak: 'break-word',
          }}
        >
          {item?.title || item?.metadata?.name}
        </Typography>
      </CardContent>
    </Card>
  ) : null
}
