import { gql, request } from 'graphql-request'
import { useQuery } from 'react-query'
import { CYBERCONNECT_ENDPOINT } from '../../../app/config'
import { IUser } from '../../../app/constants'

export const getIdentity = async (address: string) => {
  try {
    const { identity } = await request(
      CYBERCONNECT_ENDPOINT,
      gql`
        query GetIdentity($address: String!) {
          identity(address: $address) {
            address
            domain
            ens
            twitter {
              handle
              avatar
            }
            avatar
            joinTime
            followerCount
            followingCount
          }
        }
      `,
      {
        address,
      }
    )
    return identity
  } catch (err) {
    return null
  }
}

export function useIdentity({ address, data }: { address: string; data: IUser }) {
  return useQuery(['identity', address], () => getIdentity(address), {
    initialData: data,
    enabled: false,
  })
}
