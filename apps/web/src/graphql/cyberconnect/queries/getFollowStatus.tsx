import { gql, request } from 'graphql-request'
import { useQuery } from 'react-query'
import { CYBERCONNECT_ENDPOINT } from '../../../app/config'

export interface GetFollowStatusRequest {
  fromAddr: string
  toAddr: string
  onSuccess?: (data: any) => void
}

const GET_FOLLOW_STATUS = gql`
  query GetFollowStatus($fromAddr: String!, $toAddr: String!) {
    followStatus(fromAddr: $fromAddr, toAddr: $toAddr) {
      isFollowed
      isFollowing
    }
  }
`

export const getFollowStatus = async ({ fromAddr, toAddr }: GetFollowStatusRequest) => {
  try {
    const { followStatus } = await request(CYBERCONNECT_ENDPOINT, GET_FOLLOW_STATUS, { fromAddr, toAddr })
    return followStatus
  } catch (err) {
    return null
  }
}

export function useFollowStatus({ fromAddr, toAddr, ...props }: GetFollowStatusRequest) {
  return useQuery(['followStatus', fromAddr, toAddr], () => getFollowStatus({ fromAddr, toAddr }), {
    enabled: false,
    ...props,
  })
}
