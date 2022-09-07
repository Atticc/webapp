import React, { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  InputAdornmentProps,
  Stack,
  TextField,
  useTheme,
} from '@mui/material'
import useEns from '@utils/useEns'
import styled from '@emotion/styled'
import FilterIcon from '@mui/icons-material/Filter'
import { createPost } from '@req/atticc/posts'
import useWeb3Storage from '@utils/useWeb3Storage'
import { renameFile } from '@utils/helper'

const EndAdornment = styled(InputAdornment)<InputAdornmentProps>({
  alignSelf: 'flex-end',
  paddingBottom: 10,
  flexDirection: 'column',
})

type PostInputProps = {
  onSend: (msg: string) => Promise<void>
  authedAddress: string
  line?: number
}

const PostInput = ({ onSend, authedAddress, line = 4 }: PostInputProps): JSX.Element => {
  const [message, setMessage] = useState('')
  const [imageLoading, setImageLoading] = useState(false)
  const [image, setImage] = useState(null)
  const router = useRouter()
  const color = useTheme().palette
  const { name = '' } = useEns(authedAddress)
  const { upload } = useWeb3Storage()

  useEffect(() => setMessage(''), [router.query.recipientWalletAddr])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value)
  }

  const handleUploadImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        // setImage(null)
        setImageLoading(true)
        const { imageGatewayURL } = await upload({
          file: renameFile(file, String(+new Date())),
          address: authedAddress,
        })

        setImage(imageGatewayURL)
      } catch (_) {
      } finally {
        setImageLoading(false)
      }
    }
  }

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (!message) {
        return
      }
      await createPost({ address: authedAddress, description: message, imageUrl: image })
      await onSend(message)
      setMessage('')
      setImage(null)
    },
    [onSend, message, image]
  )
  return (
    <Box
      component="form"
      autoComplete="off"
      onSubmit={onSubmit}
      bgcolor={color.white.main}
      px={4.5}
      py={5.5}
      borderRadius={4}
    >
      <TextField
        multiline
        type="text"
        label={`What's new${name ? `, ${name}` : ''}?`}
        placeholder="Type your thoughts..."
        minRows={line}
        maxRows={8}
        name="message"
        value={message}
        onChange={handleChange}
        fullWidth
        sx={{ borderRadius: '20px' }}
        InputProps={{
          endAdornment: (
            <EndAdornment position="end">
              <input
                style={{ display: 'none' }}
                accept="image/*"
                id="post-image-upload"
                type="file"
                onChange={handleUploadImage}
              />
              <Button variant={'icon'} size={'small'} component={'label'} htmlFor="post-image-upload">
                <FilterIcon fontSize={'small'} />
              </Button>
            </EndAdornment>
          ),
        }}
      />
      <Stack direction={'row'} py={2}>
        {image ? <Avatar src={image} sx={{ width: '100%', height: 480 }} variant={'rounded'} /> : null}
        {imageLoading ? <CircularProgress size={90} /> : null}
      </Stack>

      <Button fullWidth variant={'fill'} sx={{ mt: 2 }} type={'submit'} disabled={!message}>
        Post
      </Button>
    </Box>
  )
}

export default PostInput
