import { Box, Modal, Stack, Tab, Tabs, useTheme } from '@mui/material'
import { useTranslation } from 'next-i18next'
import { useState } from 'react'
import { CloseIcon } from '../icons/ArrowIcon'
import { Nft } from '@alch/alchemy-web3'
import { IOatNft, IPoapNft } from '@app/types'
import { NftList } from '@c/NFT/NftList'

export enum NftType {
  nfts = 'nfts',
  poaps = 'poaps',
  oats = 'oats',
}

const tabs = [
  { label: 'NFT', value: NftType.nfts },
  { label: 'POAP', value: NftType.poaps },
  { label: 'OAT', value: NftType.oats },
]

const NftCollectionModal = ({
  open,
  onClose,
  ...props
}: {
  nfts: { items: Array<Nft>; totalCount?: number }
  poaps: { items: Array<IPoapNft>; totalCount?: number }
  oats: { items: Array<IOatNft>; totalCount?: number }
  open: boolean
  onClose: (event: {}, reason: 'backdropClick' | 'escapeKeyDown') => void
}) => {
  const { t } = useTranslation()
  const [tab, setTab] = useState<NftType>(NftType.nfts)
  const colorTheme = useTheme().palette

  const handleSetTab = (_: React.ChangeEvent<{}>, value: NftType) => {
    setTab(value)
  }

  return (
    <Modal
      open={open}
      onClose={(e) => {
        onClose(e, 'backdropClick')
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
          borderRadius: '12px',
          boxShadow: 24,
          padding: '26.5px',
          border: 0.1,
          bgcolor: colorTheme.background.default,
        }}
      >
        <Box
          component={'div'}
          onClick={(e: {}) => {
            onClose(e, 'backdropClick')
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
          <CloseIcon color={colorTheme.dark}></CloseIcon>
        </Box>
        <Stack>
          <Stack flexDirection="row" justifyContent={'center'} alignItems={'center'}>
            <Tabs value={tab} onChange={handleSetTab} aria-label="Post Tabs" variant="fullWidth">
              {tabs.map((t) => (
                <Tab
                  label={`${t.label}${props[t.value]?.totalCount ? `(${props[t.value]?.totalCount})` : ''}`}
                  value={t.value}
                  key={t.label}
                />
              ))}
            </Tabs>
          </Stack>
          <Stack
            sx={{
              minHeight: '70vh',
              maxHeight: '70vh',
              overflowY: 'auto',
              borderRadius: '12px',
              padding: '10px 16px',
              margin: '10px 0 8px 0',
            }}
          >
            <NftList data={props[tab].items} tab={tab} key={tab} />
          </Stack>
        </Stack>
      </Box>
    </Modal>
  )
}
export default NftCollectionModal
