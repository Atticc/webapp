import { Chip, Stack, Typography, useTheme } from '@mui/material'
import { formatTime } from '@utils/helper'
import { Message } from '@xmtp/xmtp-js'
import ProfileImage from '@c/users/Avatar'
import Address from '@c/users/Address'

type MessageListItemProps = {
  message: Message
  isSender: boolean
}

export const MessageListItem = ({ isSender, message }: MessageListItemProps) => {
  const color = useTheme().palette

  if (!message) {
    return null
  }

  return (
    <Stack direction={isSender ? 'row-reverse' : 'row'} paddingY={2}>
      <ProfileImage address={message.senderAddress as string} />
      <Stack direction={'column'}>
        <Stack direction={isSender ? 'row-reverse' : 'row'}>
          {isSender ? (
            <Typography paddingX={1} variant="body1">
              Me
            </Typography>
          ) : (
            <Address address={message.senderAddress || ''} variant={'body1'} />
          )}
          <Chip label={formatTime(message.sent)} variant="outlined" size="small" />
        </Stack>
        <Typography
          variant="body1"
          maxWidth={300}
          minWidth={10}
          textAlign={'left'}
          px={2}
          py={1}
          sx={{
            borderRadius: 6,
            bgcolor: isSender ? color.white.main : color.success.light,
            color: isSender ? color.black.main : color.white.main,
          }}
        >
          {
            message.error ? `Error: ${message.error?.message}` : message.content // <Emoji text={message.content || ''} />
          }
        </Typography>
      </Stack>
    </Stack>
  )
}

export default MessageListItem
