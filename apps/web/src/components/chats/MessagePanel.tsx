import { Button, CircularProgress, Divider, Grid, Stack, Typography, useTheme } from '@mui/material'
import { useXmtp } from '@utils/useXmtp'
import { useCallback, useEffect, useRef, useState } from 'react'
import useConversation from '@utils/useConversation'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import { useRouter } from 'next/router'
import { toChecksumAddress } from '@utils/helper'

interface MessagePanelProps {
  recipientAddress: string
  onConnect: () => void
}

export const MessagePanel = ({ recipientAddress, onConnect }: MessagePanelProps) => {
  const colorTheme = useTheme().palette
  const [error, setError] = useState<string | undefined>(undefined)
  const { walletAddress, client } = useXmtp()
  const messagesEndRef = useRef(null)
  const scrollToMessagesEndRef = useCallback(() => {
    ;(messagesEndRef.current as any)?.scrollIntoView({ behavior: 'smooth' })
  }, [messagesEndRef])
  const { messages, sendMessage, loading } = useConversation(recipientAddress, scrollToMessagesEndRef)

  const hasMessages = messages.length > 0
  useEffect(() => {
    if (!hasMessages) return
    const initScroll = () => {
      scrollToMessagesEndRef()
    }
    initScroll()
  }, [recipientAddress, hasMessages, scrollToMessagesEndRef])

  const checkIfOnNetwork = useCallback(
    async (address: string): Promise<boolean> => {
      return client?.canMessage(address) || false
    },
    [client]
  )

  useEffect(() => {
    async function check() {
      if (await checkIfOnNetwork(toChecksumAddress(recipientAddress))) {
        setError(undefined)
      } else {
        setError('Recipient User not register')
        // router.replace('/chats/')
      }
    }

    if (recipientAddress?.length > 0) {
      check()
    }
  }, [recipientAddress, checkIfOnNetwork])

  if (loading && !messages?.length) {
    return <CircularProgress />
  }

  if (error) {
    return (
      <Stack alignItems={'center'}>
        <Typography variant="h4">{error}</Typography>
      </Stack>
    )
  }

  if (!recipientAddress || !walletAddress || !client) {
    return (
      <Stack alignItems={'center'}>
        <Typography variant="h4">Select a conversation</Typography>
        <Typography variant="body2">Start a new conversation</Typography>
        {!client ? (
          <Button variant="fill" onClick={onConnect}>
            {'Connect'}
          </Button>
        ) : null}
      </Stack>
    )
  }

  return (
    <Grid
      container
      direction={'column'}
      maxHeight={'calc(100vh - 96px)'}
      minHeight={'calc(100vh - 96px)'}
      sx={{ overflowY: 'hidden', display: 'flex' }}
    >
      <MessageList messagesEndRef={messagesEndRef} messages={messages} walletAddress={walletAddress} />
      {walletAddress && <MessageInput onSend={sendMessage} scrollRef={scrollToMessagesEndRef} />}
    </Grid>
  )
}

export default MessagePanel
