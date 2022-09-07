import React, { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import {
  Avatar,
  Button,
  CircularProgress,
  InputAdornment,
  InputAdornmentProps,
  Stack,
  TextField,
  useTheme,
} from '@mui/material'
import styled from '@emotion/styled'
import FilterIcon from '@mui/icons-material/Filter'
import useWallet from '@utils/useWallet'
import ProfileImage from '@c/users/Avatar'
import SendIcon from '@mui/icons-material/Send'
import { createComment } from '@req/atticc/comments'
import { renameFile } from '@utils/helper'
import useWeb3Storage from '@utils/useWeb3Storage'

const EndAdornment = styled(InputAdornment)<InputAdornmentProps>({
  flexDirection: 'row',
})

type CommentInputProps = {
  onSend: (msg: string) => Promise<void>
  postId: string
}

const CommentInput = ({ onSend, postId }: CommentInputProps): JSX.Element => {
  const [message, setMessage] = useState('')
  const [imageLoading, setImageLoading] = useState(false)
  const [image, setImage] = useState(null)
  const router = useRouter()
  const { address } = useWallet()
  const { upload } = useWeb3Storage()
  const color = useTheme().palette

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
          address: String(address),
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
      const payload = { address: address as string, message, imageUrl: image, postId }
      console.log(payload)
      await createComment(payload)
      await onSend(message)
      setMessage('')
      setImage(null)
    },
    [onSend, message, image, postId]
  )
  if (!address) {
    return <></>
  }

  return (
    <Stack
      component="form"
      autoComplete="off"
      onSubmit={onSubmit}
      bgcolor={color.white.main}
      py={2}
      borderRadius={4}
      flexDirection={'row'}
      alignItems={'flex-start'}
    >
      <ProfileImage address={address} sx={{ height: 70, width: 70 }} />
      <Stack direction={'column'} width={'100% '} pl={1}>
        <TextField
          type="text"
          label={`Comments`}
          placeholder="Write a comment..."
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
                  id={`upload-comment-img-${postId}`}
                  type="file"
                  onChange={handleUploadImage}
                />
                <Button variant={'icon'} size={'small'} component={'label'} htmlFor={`upload-comment-img-${postId}`}>
                  <FilterIcon fontSize={'small'} />
                </Button>
                <Button type={'submit'} disabled={!message} variant={'icon'} size={'small'} sx={{ pl: 1 }}>
                  <SendIcon fontSize={'small'} />
                </Button>
              </EndAdornment>
            ),
          }}
        />
        <Stack direction={'row'} py={2}>
          {image ? <Avatar src={image} sx={{ width: 140, height: 140 }} variant={'rounded'} /> : null}
          {imageLoading ? <CircularProgress size={90} /> : null}
        </Stack>
      </Stack>
    </Stack>
  )
}

export default CommentInput
