import { XmtpContext } from '@utils/XmtpContext'
import { Conversation } from '@xmtp/xmtp-js/dist/types/src/conversations'
import { Message } from '@xmtp/xmtp-js'
import { useRouter } from 'next/router'
import { useContext } from 'react'
import ConversationListItem from './ConversationListItem'

type ConversationsListProps = {
  conversations: Conversation[]
}

const getLatestMessage = (messages: Message[]): Message | null =>
  messages.length ? messages[messages.length - 1] : null

const ConversationsList = ({ conversations }: ConversationsListProps): JSX.Element => {
  const router = useRouter()
  const { getMessages } = useContext(XmtpContext)
  const orderByLatestMessage = (convoA: Conversation, convoB: Conversation): number => {
    const convoAMessages = getMessages(convoA.peerAddress)
    const convoBMessages = getMessages(convoB.peerAddress)
    const convoALastMessageDate = getLatestMessage(convoAMessages)?.sent || new Date()
    const convoBLastMessageDate = getLatestMessage(convoBMessages)?.sent || new Date()
    return convoALastMessageDate < convoBLastMessageDate ? 1 : -1
  }

  return (
    <div>
      {conversations &&
        conversations.sort(orderByLatestMessage).map((convo) => {
          const isSelected = router.query?.params?.[0] == convo.peerAddress
          return <ConversationListItem key={convo.peerAddress} conversation={convo} isSelected={isSelected} />
        })}
    </div>
  )
}

export default ConversationsList
