import ProfileImage from '@c/users/Avatar'
import { Avatar, Button, Grid, LinearProgress, Stack, Tooltip, Typography, useTheme } from '@mui/material'
import { formatAddress, formatDate, formatTime } from '@utils/helper'
import { IComment } from '../../app/constants'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import Link from 'next/link'
import useWallet from '@utils/useWallet'
import { ActionType, addAction, deleteAction, useActions } from '@req/atticc/actions'
import { useEffect, useState } from 'react'
import { useComment } from '@req/atticc/comments'

export const CommentListItem = ({ comment }: { comment: IComment }) => {
  const [item, setItem] = useState<IComment>(comment)
  const color = useTheme().palette
  const { address } = useWallet()
  const [isLiked, setIsLiked] = useState(false)
  const [likeLoading, setLikeLoading] = useState(false)
  const {
    data: commentData = {},
    refetch: refetchComment,
    isLoading,
  } = useComment({ commentId: comment?.id as string })

  const handleFetchActionStatusResult = (data: any) => {
    setIsLiked(data?.[0]?.liked || false)
  }

  const { refetch: refetchLikeStatus } = useActions({
    commentId: comment?.id || '',
    address: address || '',
    onSuccess: handleFetchActionStatusResult,
  })

  useEffect(() => {
    if (commentData?.id === comment.id) {
      setItem(commentData)
    }
  }, [commentData])

  if (!comment) {
    return null
  }

  const onLike = async () => {
    try {
      setLikeLoading(true)
      isLiked
        ? await deleteAction({ address: address as string, commentId: item?.id, type: ActionType.LIKE })
        : await addAction({ address: address as string, commentId: item?.id, type: ActionType.LIKE })
      await refetchLikeStatus()
      await refetchComment()
    } catch (err: any) {
      console.warn(err.message)
    } finally {
      setLikeLoading(false)
    }
  }

  return (
    <Grid container direction={'column'} pb={2} pt={1}>
      <Grid item>
        <Stack direction={'row'}>
          <Stack direction={'column'}>
            <Link passHref href={`/users/${item?.authorAddress}`}>
              <a>
                <ProfileImage
                  sx={{ height: 70, width: 70 }}
                  address={item?.authorAddress || ''}
                  src={item?.author?.avatar || undefined}
                />
              </a>
            </Link>
          </Stack>
          <Stack direction={'column'} pl={2} flexGrow={1}>
            <Stack direction={'row'} justifyContent={'space-between'} width={'100%'}>
              <Link passHref href={`/users/${item?.authorAddress}`}>
                <Typography variant="bodyBold1" component={'a'} sx={{ cursor: 'pointer' }}>
                  {item?.author?.domain || formatAddress(item?.authorAddress as string) || ''}
                </Typography>
              </Link>
              <Stack direction={'row'}>
                <Typography variant="body2">
                  {formatDate(new Date(item.updatedAt))} at {formatTime(new Date(item.updatedAt))}
                </Typography>
              </Stack>
            </Stack>
            <Typography
              variant="body1"
              sx={{
                wordWrap: 'break-word',
                display: '-webkit-box',
                overflow: 'hidden',
                WebkitBoxOrient: 'vertical',
                // WebkitLineClamp: 3,
                whiteSpace: 'pre-line',
              }}
            >
              {item.message}
            </Typography>
            {item?.imageUrl ? (
              <Avatar src={item?.imageUrl} variant={'rounded'} sx={{ width: 140, height: 140, py: 2 }} />
            ) : null}
            <Stack direction={'row'} alignItems="center" pt={1}>
              {/* <Button sx={{ pr: 2 }}>
                <ChatBubbleOutlineIcon fontSize="small" />
                <Typography pl={1} color={color.black.main} variant={'bodyBold1'}>{comment.repliesCount}</Typography>
              </Button> */}
              <Button sx={{ pr: 2 }} onClick={onLike}>
                {isLiked ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
                {likeLoading ? (
                  <LinearProgress sx={{ pl: 3 }} />
                ) : (
                  <Typography pl={1} color={color.black.main} variant={'bodyBold1'}>
                    {Math.max(item.likes_aggregate?.aggregate?.count || 0, 0)}
                  </Typography>
                )}
              </Button>
              <Tooltip title={'Coming soon'}>
                <Button sx={{ pr: 2 }}>
                  <MoreHorizIcon fontSize="small" />
                </Button>
              </Tooltip>
            </Stack>
          </Stack>
        </Stack>
      </Grid>
    </Grid>
  )
}
