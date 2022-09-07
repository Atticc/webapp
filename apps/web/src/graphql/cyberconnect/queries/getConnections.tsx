import { gql, request } from 'graphql-request'
import { useQuery } from 'react-query'
import { CYBERCONNECT_ENDPOINT } from '../../../app/config'

export interface GetConnectionRequest {
  type?: string
  address: string
  first: number
  after?: string
  namespace?: string
}

export const GET_ADDR_CONNECTION_QUERY = gql`
  query GetConnection($address: String!, $first: Int, $after: String, $namespace: String, $type: ConnectionType) {
    identity(address: $address, network: ETH) {
      followerCount
      followingCount
      followings(type: $type, first: $first, after: $after, namespace: $namespace) {
        pageInfo {
          hasNextPage
          endCursor
        }
        list {
          address
          avatar
          domain
        }
      }
      followers(type: $type, first: $first, after: $after, namespace: $namespace) {
        pageInfo {
          hasNextPage
          endCursor
        }
        list {
          address
          avatar
          domain
        }
      }
      friends(type: $type, first: $first, after: $after, namespace: $namespace) {
        pageInfo {
          hasNextPage
          endCursor
        }
        list {
          address
          avatar
          domain
        }
      }
    }
  }
`

export const getConnection = async ({ address, first, after }: GetConnectionRequest) => {
  try {
    const { identity } = await request(CYBERCONNECT_ENDPOINT, GET_ADDR_CONNECTION_QUERY, { address, first, after })
    return identity
  } catch (err) {
    return null
  }
}

export function useConnections({ address, first, after, ...props }: GetConnectionRequest) {
  return useQuery(['connections', address], async () => getConnection({ address, first, after }), {
    enabled: false,
    ...props,
  })
}
