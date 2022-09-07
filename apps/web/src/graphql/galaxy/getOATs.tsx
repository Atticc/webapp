import { gql, request } from 'graphql-request'
import { useQuery } from 'react-query'
import { GALAXY_OAT_ENDPOINT } from '../../app/config'

export interface GetOATsRequest {
  address: string
}

export const GET_GALAXY_OAT = gql`
  query getOATs($address: String!) {
    addressInfo(address: $address) {
      nfts(option: { orderBy: ID, order: ASC }) {
        totalCount
        list {
          id
          chain
          image
          name
          description
          animationURL
        }
      }
    }
  }
`

export const getOATs = async ({ address }: GetOATsRequest) => {
  try {
    const { addressInfo: { nfts = {} } = {} } = await request(GALAXY_OAT_ENDPOINT, GET_GALAXY_OAT, { address })
    return nfts
  } catch (err) {
    return null
  }
}

export function useOATs({ address, ...props }: GetOATsRequest) {
  return useQuery(['oats', address], async () => getOATs({ address }), {
    enabled: false,
    ...props,
  })
}
