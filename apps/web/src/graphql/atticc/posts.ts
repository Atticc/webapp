import { ATTICC_API_ENDPOINT } from '@app/config'
import { gql, request } from 'graphql-request'
import { useQuery } from 'react-query'
import { ATTIC_DEFAULT_HEADERS } from './headers'
export interface GetPostsRequest {
  addresses?: Array<string>
  postId?: string | null
}
export interface CreatePostsRequest {
  address: string
  description: string
  imageUrl?: string | null
  title?: string | null
}

export const GET_POSTS = ({ addresses, postId }: { addresses: any; postId: string }) => gql`
  query MyQuery($addresses: [String], $postId: uuid) {
    atticcdev_post(
      ${addresses?.length > 0 ? 'where: { authorAddress: { _in: $addresses } },' : ''} 
      ${postId?.length > 0 ? 'where: { id: { _eq: $postId } },' : ''} 
      order_by: { updatedAt: desc }
    ) {
      createdAt
      description
      id
      imageUrl
      postId
      title
      updatedAt
      sharesCount
      authorAddress
      author {
        address
        avatar
        domain
      }
      likes_aggregate(where: {action: {_eq: LIKE}}) {
        aggregate {
          count
        }
      }
      comments_aggregate {
        aggregate {
          count
        }
      }
      comments(limit: 50, order_by: { updatedAt: desc }) {
        createdAt
        updatedAt
        id
        imageUrl
        likes_aggregate(where: {action: {_eq: LIKE}}) {
          aggregate {
            count
          }
        }
        message
        authorAddress
        author {
          address
          avatar
          domain
        }
      }
    }
  }
`

export const getPosts = async ({ addresses, postId }: GetPostsRequest) => {
  try {
    const { atticcdev_post } = await request(
      ATTICC_API_ENDPOINT,
      GET_POSTS({ addresses, postId: postId || '' }),
      { addresses, postId },
      ATTIC_DEFAULT_HEADERS
    )
    return atticcdev_post
  } catch (err) {
    return null
  }
}

export function usePosts({ addresses, postId, ...props }: GetPostsRequest) {
  return useQuery(['posts', String(addresses), postId], async () => getPosts({ addresses, postId }), {
    enabled: false,
    ...props,
  })
}

export const CREATE_POSTS = gql`
  mutation MyMutation($description: String, $address: String, $imageUrl: String) {
    insert_atticcdev_post_one(object: { authorAddress: $address, description: $description, imageUrl: $imageUrl }) {
      id
    }
  }
`

export const createPost = async ({ address, description, imageUrl }: CreatePostsRequest) => {
  try {
    const res = await request(
      ATTICC_API_ENDPOINT,
      CREATE_POSTS,
      { address, description, imageUrl },
      ATTIC_DEFAULT_HEADERS
    )
    return res
  } catch (err) {
    return null
  }
}

export function useCreatePost({ address, description, imageUrl, ...props }: CreatePostsRequest) {
  return useQuery(['posts', address], async () => createPost({ address, description, imageUrl }), {
    enabled: false,
    ...props,
  })
}
