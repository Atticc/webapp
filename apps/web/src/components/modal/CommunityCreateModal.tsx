import { Box, Divider, Modal, Stack, SxProps, TextField, Theme, Typography, useTheme } from '@mui/material'
import { useTranslation } from 'next-i18next'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { ArrowIcon, CloseIcon } from '../icons/ArrowIcon'

const CommunityCreateModal = (props: {
  open: boolean
  onClose: (event: {}, reason: 'backdropClick' | 'escapeKeyDown') => void
}) => {
  const [value, setValue] = useState(0)
  interface TabPanelProps {
    children?: React.ReactNode
    index: number
    value: number
    sx?: SxProps<Theme> | undefined
  }

  function TabPanel(props: TabPanelProps) {
    const { children, value, index, sx, ...other } = props

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ p: 3, ...sx }}>{children}</Box>}
      </div>
    )
  }

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  const { t } = useTranslation()
  const colorTheme = useTheme().palette
  const router = useRouter()

  return (
    <Modal
      open={props.open}
      onClose={(e) => {
        props.onClose(e, 'backdropClick')
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{
        background: colorTheme.modalbgcolor.main,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          bgcolor: colorTheme.gray.main,
          borderRadius: '12px',
          boxShadow: 24,
          padding: '26.5px',
        }}
      >
        <Box
          component={'div'}
          onClick={(e: {}) => {
            props.onClose(e, 'backdropClick')
          }}
          sx={{
            cursor: 'pointer',
            position: 'absolute',
            display: 'inline-flex',
            verticalAlign: 'middle',
            top: '26.5px',
            right: '26.5px',
          }}
        >
          <CloseIcon color={colorTheme.black}></CloseIcon>
        </Box>
        <Stack>
          <Stack flexDirection="row" justifyContent={'center'} alignItems={'center'}>
            <Typography
              variant="h2"
              color={colorTheme.black.main}
              sx={{
                marginRight: '20px',
              }}
            >
              {'Create Community'}
            </Typography>
          </Stack>
          <Stack
            sx={{
              borderRadius: '12px',
              padding: '24px 16px',
              margin: '10px 0 8px 0',
            }}
          >
            <TextField
              placeholder="Group Name"
              sx={{
                width: '100%',
              }}
            />
          </Stack>
          <Stack
            sx={{
              borderRadius: '12px',
              padding: '24px 16px',
              margin: '10px 0 8px 0',
            }}
          >
            <TextField
              placeholder="Description"
              sx={{
                width: '100%',
              }}
            />
          </Stack>
          <Stack
            sx={{
              borderRadius: '12px',
              padding: '24px 16px',
              margin: '10px 0 8px 0',
            }}
          >
            <TextField
              placeholder="Primary Token"
              sx={{
                width: '100%',
              }}
            />
          </Stack>
          <Stack
            sx={{
              borderRadius: '12px',
              padding: '24px 16px',
              margin: '10px 0 8px 0',
            }}
          >
            <TextField
              placeholder="Primary NFT Contract"
              sx={{
                width: '100%',
              }}
            />
          </Stack>
        </Stack>
      </Box>
    </Modal>
  )
}
export default CommunityCreateModal
