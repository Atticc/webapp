import { useCallback, useEffect, useReducer, useState } from 'react'
import { ClientOptions, Conversation } from '@xmtp/xmtp-js'
import { Client, Message } from '@xmtp/xmtp-js'
import { Signer } from 'ethers'
import useMessageStore from './useMessageStore'

import { createContext, Dispatch } from 'react'

export type MessageStoreEvent = {
  peerAddress: string
  messages: Message[]
}

export type XmtpContextType = {
  wallet: Signer | undefined
  walletAddress: string | undefined
  client: Client | undefined
  conversations: Conversation[]
  loadingConversations: boolean
  getMessages: (peerAddress: string) => Message[]
  dispatchMessages?: Dispatch<MessageStoreEvent>
  connect: (wallet: Signer) => void
  disconnect: () => void
}

export const XmtpContext = createContext<XmtpContextType>({
  wallet: undefined,
  walletAddress: undefined,
  client: undefined,
  conversations: [],
  loadingConversations: false,
  getMessages: () => [],
  connect: () => undefined,
  disconnect: () => undefined,
})

export const XmtpProvider = ({ children }: { children: JSX.Element }) => {
  const [wallet, setWallet] = useState<Signer>()
  const [walletAddress, setWalletAddress] = useState<string>()
  const [client, setClient] = useState<Client>()
  const { getMessages, dispatchMessages } = useMessageStore()
  const [loadingConversations, setLoadingConversations] = useState<boolean>(false)

  const [conversations, dispatchConversations] = useReducer(
    (state: Conversation[], newConvos: Conversation[] | undefined) => {
      if (newConvos === undefined) {
        return []
      }
      newConvos = newConvos.filter(
        (convo) =>
          state.findIndex((otherConvo) => {
            return convo.peerAddress === otherConvo.peerAddress
          }) < 0 && convo.peerAddress != client?.address
      )
      return newConvos === undefined ? [] : state.concat(newConvos)
    },
    []
  )

  const connect = useCallback(
    async (wallet: Signer) => {
      setWallet(wallet)
      const walletAddr = await wallet.getAddress()
      setWalletAddress(walletAddr)
    },
    [setWallet, setWalletAddress]
  )

  const disconnect = useCallback(async () => {
    setWallet(undefined)
    setWalletAddress(undefined)
    setClient(undefined)
    dispatchConversations(undefined)
  }, [setWallet, setWalletAddress, setClient, dispatchConversations])

  useEffect(() => {
    const initClient = async () => {
      if (!wallet) return
      const opts: Partial<ClientOptions> = {
        waitForPeersTimeoutMs: 20_000,
        // env: 'production',
      }
      setClient(await Client.create(wallet, opts))
    }
    initClient()
  }, [wallet])

  useEffect(() => {
    const listConversations = async () => {
      if (!client) return
      setLoadingConversations(true)
      const convos = await client.conversations.list()
      convos.forEach((convo: Conversation) => {
        dispatchConversations([convo])
      })
      setLoadingConversations(false)
    }
    listConversations()
  }, [client, walletAddress])

  useEffect(() => {
    const streamConversations = async () => {
      if (!client) return
      const stream = await client.conversations.stream()
      for await (const convo of stream) {
        dispatchConversations([convo])
      }
    }
    streamConversations()
  }, [client, walletAddress])

  const [providerState, setProviderState] = useState<XmtpContextType>({
    wallet,
    walletAddress,
    client,
    conversations,
    loadingConversations,
    getMessages,
    dispatchMessages,
    connect,
    disconnect,
  })

  useEffect(() => {
    setProviderState({
      wallet,
      walletAddress,
      client,
      conversations,
      loadingConversations,
      getMessages,
      dispatchMessages,
      connect,
      disconnect,
    })
  }, [
    wallet,
    walletAddress,
    client,
    conversations,
    loadingConversations,
    getMessages,
    dispatchMessages,
    connect,
    disconnect,
  ])

  return <XmtpContext.Provider value={providerState}>{children}</XmtpContext.Provider>
}

export default XmtpProvider
