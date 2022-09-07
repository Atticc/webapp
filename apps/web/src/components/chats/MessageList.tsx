import { Chip, Divider, Grid, Typography } from '@mui/material'
import { Message } from '@xmtp/xmtp-js'
import React, { MutableRefObject } from 'react'
import MessageListItem from './MessageListItem'

export type MessageListProps = {
  messages: Message[]
  walletAddress: string | undefined
  messagesEndRef: MutableRefObject<null>
}

const isOnSameDay = (d1?: Date, d2?: Date): boolean => {
  return d1?.toDateString() === d2?.toDateString()
}

const formatDate = (d?: Date) => d?.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

const DateDivider = ({ date }: { date?: Date }): JSX.Element => (
  <Divider>
    <Chip label={formatDate(date)} />
  </Divider>
)

const ConversationBeginningNotice = (): JSX.Element => (
  <Grid item alignItems={'center'} justifyItems={'center'} paddingBottom={4}>
    <Typography variant="body2" textAlign={'center'}>
      Start of the conversation
    </Typography>
  </Grid>
)

const MessagesList = ({ messages, walletAddress, messagesEndRef }: MessageListProps): JSX.Element => {
  let lastMessageDate: Date | undefined

  const renderMessage = (msg: Message) => {
    const isSender = msg.senderAddress === walletAddress
    const dateHasChanged = !isOnSameDay(lastMessageDate, msg.sent)
    lastMessageDate = msg.sent

    return (
      <Grid item key={msg.id}>
        {dateHasChanged ? <DateDivider date={msg.sent} /> : null}
        <MessageListItem message={msg} isSender={isSender} />
      </Grid>
    )
  }

  return (
    <Grid container sx={{ display: 'flex', flexGrow: 1, overflowY: 'auto' }} maxHeight={'calc(100vh - 200px)'}>
      <Grid container sx={{ alignSelf: 'flex-end' }} width={'100%'}>
        <Grid item width={'100%'} flex={1}>
          {messages && messages.length ? <ConversationBeginningNotice /> : null}
          {messages?.map(renderMessage)}
          <div ref={messagesEndRef} />
        </Grid>
      </Grid>
    </Grid>
  )
}
export default React.memo(MessagesList)
