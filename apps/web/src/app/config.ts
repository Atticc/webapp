export const CYBERCONNECT_ENDPOINT: string =
  process.env.NEXT_PUBLIC_CYBERCONNECT_ENDPOINT || 'https://api.cybertino.io/connect/'
export const GALAXY_OAT_ENDPOINT: string =
  process.env.NEXT_PUBLIC_GALAZY_OAT_ENDPOINT || 'https://graphigo.stg.galaxy.eco/query'
export const POAP_API_URL: string = process.env.NEXT_PUBLIC_POAP_API_URL || 'https://frontend.poap.tech'
export const ALCHEMY_RPC_ETH: string = process.env.NEXT_PUBLIC_ALCHEMY_RPC_ETH || ''
export const APP_NAME: string = process.env.NEXT_PUBLIC_APP_NAME || 'Atticc'
export const NODE_ENV: string = process.env.NODE_ENV || 'development'
export const NEXT_PUBLIC_HOSTNAME: string = process.env.NEXT_PUBLIC_HOSTNAME || 'localhost:3000'
export const WEB3_STORAGE_API_TOKEN: string = process.env.NEXT_PUBLIC_WEB3_STORAGE_API_TOKEN || 'jwt:jwt:jwt'
export const ATTICC_API_ENDPOINT: string =
  process.env.NEXT_PUBLIC_ATTICC_API_ENDPOINT || 'https://query.dev.atticc.xyz/v1/graphql'
export const ATTICC_API_SECRET: string = process.env.NEXT_PUBLIC_ATTICC_API_SECRET || 'user@password'

export const Networks = {
  Ethereum: {
    id: 1,
    rpc: ALCHEMY_RPC_ETH,
  },
}
