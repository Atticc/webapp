import { useCallback, useEffect, useState, createContext } from 'react'
import { Signer, ethers as Ether } from 'ethers'
import Web3Modal, { providers } from 'web3modal-dynamic-import'
import CyberConnect from '@cyberlab/cyberconnect'
import { ALCHEMY_RPC_ETH, Networks } from '@app/config'
import { useTheme } from '@mui/material/styles'

export type WalletContextType = {
  provider: Ether.providers.Web3Provider | Ether.providers.BaseProvider | undefined
  signer: Signer | undefined
  address: string | undefined
  web3Modal: Web3Modal | undefined
  cyberConnect: CyberConnect | undefined
  resolveName: (name: string) => Promise<string | undefined>
  lookupAddress: (address: string) => Promise<string | undefined>
  getAvatarUrl: (address: string) => Promise<string | undefined>
  getBalance: (address: string) => Promise<string | undefined>
  connect: () => Promise<Signer | undefined>
  disconnect: () => Promise<void>
}

export const WalletContext = createContext<WalletContextType>({
  provider: undefined,
  signer: undefined,
  address: undefined,
  web3Modal: undefined,
  cyberConnect: undefined,
  resolveName: async () => undefined,
  lookupAddress: async () => undefined,
  getAvatarUrl: async () => undefined,
  getBalance: async () => undefined,
  connect: async () => undefined,
  disconnect: async () => undefined,
})

const cachedLookupAddress = new Map<string, string | undefined>()
const cachedResolveName = new Map<string, string | undefined>()
const cachedGetAvatarUrl = new Map<string, string | undefined>()
const cachedBalance = new Map<string, string>()

type WalletProviderProps = {
  children?: React.ReactNode
}

export const WalletProvider = ({ children }: WalletProviderProps): JSX.Element => {
  const theme = useTheme()
  const [provider, setProvider] = useState<Ether.providers.WebSocketProvider | Ether.providers.BaseProvider>(
    Ether.providers.getDefaultProvider()
  )
  const [signer, setSigner] = useState<Signer>()
  const [cyberConnect, setCyberConnect] = useState<CyberConnect>()
  const [web3Modal, setWeb3Modal] = useState<Web3Modal>()
  const [address, setAddress] = useState<string>()

  const initCyberConnect = useCallback((provider: any) => {
    const cyberConnect = new CyberConnect({
      provider,
      namespace: 'CyberGraph',
    })

    setCyberConnect(cyberConnect)
  }, [])

  const resolveName = useCallback(
    async (name: string) => {
      if (cachedResolveName.has(name)) {
        return cachedResolveName.get(name)
      }
      try {
        const address = (await provider?.resolveName(name)) || undefined
        cachedResolveName.set(name, address)
        return address
      } catch (_) {
        return undefined
      }
    },
    [provider]
  )

  const getBalance = useCallback(
    async (address: string) => {
      if (cachedBalance.has(address)) {
        return cachedBalance.get(address)
      }
      try {
        const balance = (await provider?.getBalance(address)) || '0'
        const stringBalance = balance.toString()
        cachedBalance.set(address, stringBalance)
        return stringBalance
      } catch (_) {
        return '0'
      }
    },
    [provider]
  )

  const lookupAddress = useCallback(
    async (address: string) => {
      if (cachedLookupAddress.has(address)) {
        return cachedLookupAddress.get(address)
      }
      try {
        const name = (await provider?.lookupAddress(address)) || undefined
        cachedLookupAddress.set(address, name)
        return name
      } catch (_) {
        return undefined
      }
    },
    [provider]
  )

  const getAvatarUrl = useCallback(
    async (name: string) => {
      if (cachedGetAvatarUrl.has(name)) {
        return cachedGetAvatarUrl.get(name)
      }
      try {
        const avatarUrl = (await provider?.getAvatar(name)) || undefined
        cachedGetAvatarUrl.set(name, avatarUrl)
        return avatarUrl
      } catch (_) {
        return undefined
      }
    },
    [provider]
  )

  const disconnect = useCallback(async () => {
    if (!web3Modal) return
    web3Modal.clearCachedProvider()
    localStorage.removeItem('walletconnect')
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('-walletlink')) {
        localStorage.removeItem(key)
      }
    })
    setAddress(undefined)
    setSigner(undefined)
    setCyberConnect(undefined)
  }, [web3Modal])

  const handleAccountsChanged = useCallback(
    async (accounts: string[]) => {
      if (address && accounts.indexOf(address) < 0) {
        await disconnect()
      }
    },
    [address, disconnect]
  )

  const handleSetup = useCallback(
    async (instance: any) => {
      instance.on('accountsChanged', handleAccountsChanged)
      try {
        // return import('ethers').then(async ({ ethers }) => {
        const provider = new Ether.providers.Web3Provider(instance)
        const signer = provider.getSigner()
        setProvider(provider)
        setSigner(signer)
        setAddress(await signer.getAddress())
        initCyberConnect(provider.provider)
        return signer
        // })
      } catch (e) {
        console.log('Error while creating ethers provider')
      }
    },
    [handleAccountsChanged, initCyberConnect]
  )

  const connect = useCallback(async () => {
    if (!web3Modal) throw new Error('web3Modal not initialized')
    try {
      const instance = await web3Modal.connect()
      instance.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: Ether.utils.hexValue(Networks.Ethereum.id) }],
      })
      if (!instance) return
      const signer = await handleSetup(instance)
      return signer
    } catch (e) {
      // TODO: better error handling/surfacing here.
      // Note that web3Modal.connect throws an error when the user closes the
      // modal, as "User closed modal"
      console.log('error', e)
    }
  }, [web3Modal, handleSetup])

  useEffect(() => {
    const providerOptions: any = {
      walletconnect: {
        package: () => import('@walletconnect/web3-provider'),
        packageFactory: true,
        options: {
          rpc: {
            1: ALCHEMY_RPC_ETH,
          },
        },
      },
    }
    if (!window?.ethereum || !window?.ethereum?.isMetaMask) {
      providerOptions['custom-metamask'] = {
        display: {
          logo: providers.METAMASK.logo,
          name: 'Install MetaMask',
          description: 'Connect using browser wallet',
        },
        package: {},
        connector: async () => {
          window?.open('https://metamask.io')
          // throw new Error("MetaMask not installed");
        },
      }
    }
    setWeb3Modal(new Web3Modal({ cacheProvider: true, providerOptions, theme: theme.palette.mode }))
  }, [theme.palette.mode])

  useEffect(() => {
    if (!web3Modal) return
    const initCached = async () => {
      const cachedProviderJson = localStorage.getItem('WEB3_CONNECT_CACHED_PROVIDER')
      if (!cachedProviderJson) return
      const cachedProviderName = JSON.parse(cachedProviderJson)
      const instance = await web3Modal.connectTo(cachedProviderName)
      if (!instance) return
      await handleSetup(instance)
    }
    initCached()
  }, [web3Modal, handleAccountsChanged, handleSetup])

  return (
    <WalletContext.Provider
      value={{
        provider,
        signer,
        address,
        web3Modal,
        cyberConnect,
        resolveName,
        lookupAddress,
        getBalance,
        getAvatarUrl,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}
