import { ATTICC_API_ENDPOINT } from '@app/config'
import { gql, request } from 'graphql-request'
import { useQuery } from 'react-query'
import { ATTIC_DEFAULT_HEADERS } from './headers'

interface RegisterUserRequest {
  address: string
  domain?: string
  avatar?: string
}

interface GetUserRequest {
  address: string
}

export const GET_PROFILE = gql`
  query MyQuery($address: String!) {
    atticcdev_user_by_pk(address: $address) {
      address
    }
  }
`

export const getProfile = async ({ address }: GetUserRequest) => {
  try {
    const { atticcdev_user_by_pk } = await request(ATTICC_API_ENDPOINT, GET_PROFILE, { address }, ATTIC_DEFAULT_HEADERS)
    return atticcdev_user_by_pk
  } catch (err) {
    return null
  }
}

export function useProfile({ address, ...props }: GetUserRequest) {
  return useQuery(['users', address], async () => getProfile({ address }), {
    enabled: false,
    ...props,
  })
}

export const MUTATE_REGISTER_USER = gql`
  mutation MyQuery($address: String!, $domain: String, $avatar: String) {
    insert_atticcdev_user_one(object: { address: $address, domain: $domain, avatar: $avatar }) {
      address
    }
  }
`

export const registerUser = async ({ address, domain, avatar }: RegisterUserRequest) => {
  try {
    const res = await request(
      ATTICC_API_ENDPOINT,
      MUTATE_REGISTER_USER,
      { address, domain, avatar },
      ATTIC_DEFAULT_HEADERS
    )
    return res
  } catch (err) {
    return null
  }
}

export function useRegister({ address, domain, avatar, ...props }: RegisterUserRequest) {
  return useQuery(['users', address], async () => registerUser({ address, domain, avatar }), {
    enabled: false,
    ...props,
  })
}
