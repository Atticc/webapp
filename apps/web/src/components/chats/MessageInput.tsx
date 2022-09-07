import React, { Ref, useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Box, Chip, Grid, InputAdornment, TextField } from '@mui/material'

type MessageInputProps = {
  onSend: (msg: string) => Promise<void>
  scrollRef: () => void
}

const MessageInput = ({ onSend, scrollRef }: MessageInputProps): JSX.Element => {
  const [message, setMessage] = useState('')
  const router = useRouter()

  useEffect(() => setMessage(''), [router.query.recipientWalletAddr])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value)
  }

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (!message) {
        return
      }
      setMessage('')
      await onSend(message)
      scrollRef()
    },
    [onSend, message]
  )
  return (
    <Grid item pt={3} width={'100%'}>
      <Box component="form" autoComplete="off" onSubmit={onSubmit}>
        <TextField
          margin="dense"
          type="text"
          label={'Message'}
          placeholder="Type something..."
          name="message"
          value={message}
          required
          onChange={handleChange}
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Chip label={'Send'} clickable component="button" disabled={!message} type={'submit'} />
              </InputAdornment>
            ),
          }}
        />
      </Box>
    </Grid>
  )
}

export default MessageInput
