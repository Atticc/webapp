import { ATTICC_API_ENDPOINT } from '@app/config'
import { gql, request } from 'graphql-request'
import { useQuery } from 'react-query'
import { ATTIC_DEFAULT_HEADERS } from './headers'

export enum ActionType {
  BOOKMARK = 'BOOKMARK',
  LIKE = 'LIKE',
  SHARE = 'SHARE',
}

interface ActionRequest {
  address: string
  commentId?: string
  postId?: string
  type?: ActionType
  liked?: boolean
  onSuccess?: (data: any) => void
}

export const DELETE_ACTION = ({ postId, commentId }: { commentId: string; postId: string }) => gql`
  mutation MyMutation($address: String = "", $postId: uuid = "", $commentId: uuid = "", $type: atticcdev_ACTION_TYPE_enum = LIKE, $liked: Boolean = true) {
  delete_atticcdev_action(where: {
    _and: {
      liked: {_eq: $liked}
      userAddress: {_eq: $address}, 
      action: {_eq: $type}
      ${postId?.length > 0 ? ',postId: {_eq: $postId}' : ''}
      ${commentId?.length > 0 ? ',commentId: {_eq: $commentId}' : ''}
  }}) {
    returning {
      id
    }
  }
}
`

export const deleteAction = async ({
  address,
  commentId,
  postId,
  type = ActionType.LIKE,
  liked = true,
}: ActionRequest) => {
  try {
    const res = await request(
      ATTICC_API_ENDPOINT,
      DELETE_ACTION({ commentId: commentId || '', postId: postId || '' }),
      { address, commentId, postId, type, liked },
      ATTIC_DEFAULT_HEADERS
    )
    return res
  } catch (err) {
    return null
  }
}

export function useDeleteAction({ address, commentId, postId, type, liked, ...props }: ActionRequest) {
  return useQuery(
    ['action-delete', type, address, commentId, postId],
    async () => deleteAction({ address, commentId, postId, type, liked }),
    {
      enabled: false,
      ...props,
    }
  )
}

export const ADD_ACTION = ({ postId, commentId }: { commentId: string; postId: string }) => gql`
  mutation MyMutation($address: String, $commentId: uuid, $postId: uuid, $type: atticcdev_ACTION_TYPE_enum = LIKE, $liked: Boolean = true) {
    insert_atticcdev_action_one(object: {liked: $liked, userAddress: $address, action: $type 
    ${postId?.length > 0 ? ',postId: $postId' : ''}
    ${commentId?.length > 0 ? ',commentId: $commentId' : ''}}) {
      id
    }
  }
`

export const addAction = async ({
  address,
  commentId,
  postId,
  type = ActionType.LIKE,
  liked = true,
}: ActionRequest) => {
  try {
    const res = await request(
      ATTICC_API_ENDPOINT,
      ADD_ACTION({ commentId: commentId || '', postId: postId || '' }),
      { address, commentId, postId, type, liked },
      ATTIC_DEFAULT_HEADERS
    )
    return res
  } catch (err) {
    return null
  }
}

export function useAddAction({ address, commentId, postId, type, liked, ...props }: ActionRequest) {
  return useQuery(
    ['action-add', type, address, commentId, postId],
    async () => addAction({ address, commentId, postId, type, liked }),
    {
      enabled: false,
      ...props,
    }
  )
}

export const GET_ACTIONS = ({ postId, commentId }: { commentId: string; postId: string }) => gql`
  query MyQuery($address: String, $commentId: uuid, $postId: uuid, $type: atticcdev_ACTION_TYPE_enum = LIKE, $liked: Boolean = true) {
  atticcdev_action(where: {
    userAddress: {_eq: $address}
    , action: {_eq: $type} 
    , liked: {_eq: $liked}
    ${postId?.length > 0 ? ',postId: {_eq: $postId}' : ''}
    ${commentId?.length > 0 ? ',commentId: {_eq: $commentId}' : ''}
  }) {
    userAddress
    postId
    commentId
    action
    liked
  }
}
`

export const getActions = async ({
  address,
  commentId,
  postId,
  type = ActionType.LIKE,
  liked = true,
}: ActionRequest) => {
  try {
    const { atticcdev_action } = await request(
      ATTICC_API_ENDPOINT,
      GET_ACTIONS({ commentId: commentId || '', postId: postId || '' }),
      { address, commentId, postId, type, liked },
      ATTIC_DEFAULT_HEADERS
    )
    return atticcdev_action
  } catch (err) {
    return null
  }
}

export function useActions({ address, commentId, postId, type, liked, ...props }: ActionRequest) {
  return useQuery(
    ['actions', type, address, commentId, postId],
    async () => getActions({ address, commentId, postId, type, liked }),
    {
      enabled: false,
      ...props,
    }
  )
}
