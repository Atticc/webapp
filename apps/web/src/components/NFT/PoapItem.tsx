import { Avatar, Box, Card, CardContent, CardMedia, CircularProgress, Stack, Tooltip, Typography } from '@mui/material'
import { useState } from 'react'
import { IPoapNft } from '../../app/types'

export const PoapItem = ({
  poap,
  height = 262,
  width = 262,
}: {
  poap: IPoapNft | undefined
  height?: number
  width?: number
}) => {
  const [show, setShow] = useState(true)
  const [loading, setLoading] = useState(true)
  if (!poap) {
    return null
  }

  const handleError = () => {
    setShow(false)
  }

  const handleLoad = () => {
    setLoading(false)
  }

  return show ? (
    <Card sx={{ maxWidth: width, width: width, borderRadius: '20px' }}>
      <CardMedia
        // sx={{objectFit: 'contain'}}
        component="img"
        height={height}
        image={poap.event.image_url}
        alt={poap.event.name}
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
          {poap.event.name}
        </Typography>
      </CardContent>
    </Card>
  ) : null
}
