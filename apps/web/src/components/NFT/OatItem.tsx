import { Avatar, Card, CardContent, CardMedia, CircularProgress, Stack, Tooltip, Typography } from '@mui/material'
import { useState } from 'react'
import { IOatNft } from '../../app/types'

export const OatItem = ({
  oat,
  height = 262,
  width = 262,
}: {
  oat: IOatNft | undefined
  width?: number
  height?: number
}) => {
  const [show, setShow] = useState(true)
  const [loading, setLoading] = useState(true)
  if (!oat) {
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
        image={oat?.image}
        alt={oat?.name}
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
          {oat.name}
        </Typography>
      </CardContent>
    </Card>
  ) : null
}
