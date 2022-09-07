import { gql, request } from 'graphql-request'
import { useQuery } from 'react-query'
import { CYBERCONNECT_ENDPOINT } from '../../../app/config'
import { IUser } from '../../../app/constants'

export const getRecommendations = async (address: string) => {
  try {
    const { recommendations } = await request(
      CYBERCONNECT_ENDPOINT,
      gql`
        query GetRecommendations($address: String!) {
          recommendations(first: 5, address: $address) {
            result
            data {
              pageInfo {
                startCursor
                endCursor
                hasNextPage
                hasPreviousPage
              }
              list {
                address
                domain
                ens
                avatar
                recommendationReason
                followerCount
              }
            }
          }
        }
      `,
      {
        address,
      }
    )
    return recommendations?.data?.list || []
  } catch (err) {
    return []
  }
}

export function useRecommendation({ address, onSuccess }: { address: string; onSuccess: (data: [IUser]) => void }) {
  return useQuery(['recommendations', address], () => getRecommendations(address), { enabled: false, onSuccess })
}
