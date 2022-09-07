import { ATTICC_API_ENDPOINT } from '@app/config'
import { gql, request } from 'graphql-request'
import { useQuery } from 'react-query'
import { ATTIC_DEFAULT_HEADERS } from './headers'
export interface GetCommentRequest {
  commentId: string
}

export interface GetCommentsRequest {
  postId: string
  offset?: number
}

export interface CreateCommentRequest {
  address: string
  postId: string
  message: string
  imageUrl?: string | null
}

export const CREATE_COMMENT = gql`
  mutation MyMutation($message: String, $address: String, $imageUrl: String, $postId: uuid) {
    insert_atticcdev_comment_one(
      object: { postId: $postId, authorAddress: $address, imageUrl: $imageUrl, message: $message }
    ) {
      id
    }
  }
`

export const createComment = async ({ address, message, postId, imageUrl }: CreateCommentRequest) => {
  try {
    const res = await request(
      ATTICC_API_ENDPOINT,
      CREATE_COMMENT,
      { address, message, postId, imageUrl },
      ATTIC_DEFAULT_HEADERS
    )
    return res
  } catch (err) {
    return null
  }
}

export function useCreateComment({ address, message, postId, imageUrl, ...props }: CreateCommentRequest) {
  return useQuery(['comment', postId], async () => createComment({ address, message, postId, imageUrl }), {
    enabled: false,
    ...props,
  })
}

export const GET_COMMENT = gql`
  query mq($commentId: uuid!) {
    atticcdev_comment_by_pk(id: $commentId) {
      createdAt
      updatedAt
      id
      imageUrl
      likes_aggregate(where: { action: { _eq: LIKE } }) {
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
`

export const getComment = async ({ commentId }: GetCommentRequest) => {
  try {
    const { atticcdev_comment_by_pk = {} } = await request(
      ATTICC_API_ENDPOINT,
      GET_COMMENT,
      { commentId },
      ATTIC_DEFAULT_HEADERS
    )
    return atticcdev_comment_by_pk
  } catch (err) {
    return null
  }
}

export function useComment({ commentId, ...props }: GetCommentRequest) {
  return useQuery(['comment', commentId], async () => getComment({ commentId }), {
    enabled: false,
    ...props,
  })
}
