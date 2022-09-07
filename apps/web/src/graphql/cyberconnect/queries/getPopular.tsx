import { gql, request } from 'graphql-request'
import { useQuery } from 'react-query'
import { CYBERCONNECT_ENDPOINT } from '../../../app/config'
import { IUser } from '../../../app/constants'

interface GetPopularRequest {
  first: number
  onSuccess: (data: [IUser]) => void
  enabled?: boolean
}

export const getPopular = async ({ first }: { first: number }) => {
  try {
    const { popular } = await request(
      CYBERCONNECT_ENDPOINT,
      gql`
        query ($first: Int!) {
          popular(first: $first, tags: { list: [PLAZA] }) {
            list {
              address
              domain
              avatar
              followerCount
              recommendationReason
              isFollowing
            }
          }
        }
      `,
      {
        first,
      }
    )
    return popular.list
  } catch (err) {
    return null
  }
}

export function usePopular({ first, ...props }: GetPopularRequest) {
  return useQuery(['popular'], () => getPopular({ first }), {
    enabled: false,
    ...props,
  })
}
