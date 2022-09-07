import { Nft } from '@alch/alchemy-web3'
import { Divider, Grid, Typography } from '@mui/material'
import { IOatNft, IPoapNft } from '../../app/types'
import { NftType } from '../modal/NftCollectionModal'
import { NftItem } from './NftItem'
import { OatItem } from './OatItem'
import { PoapItem } from './PoapItem'

export const NftList = ({
  title,
  data,
  tab,
}: {
  title?: string
  tab: NftType
  data: Array<Nft | IPoapNft | IOatNft>
}) => {
  function renderNFT(nft: Nft) {
    const key = `${nft.contract.address}-${nft.id.tokenId}`
    return <NftItem key={key} nft={nft} />
  }

  function renderPOAP(poap: IPoapNft) {
    return <PoapItem poap={poap} key={poap.tokenId} />
  }

  function renderOAT(oat: IOatNft) {
    return <OatItem oat={oat} key={oat.id} />
  }

  return (
    <Grid container direction={'column'} sx={{ borderRadius: 2, paddingX: 2, paddingY: 2 }}>
      <Grid item>
        <Typography marginBottom={1} variant="h5">
          {title}
        </Typography>
        {title ? <Divider /> : null}
      </Grid>
      <Grid container direction={'row'} flexWrap={'wrap'} gap={2}>
        {data?.map((item) =>
          tab === NftType.nfts
            ? renderNFT(item as Nft)
            : tab === NftType.poaps
            ? renderPOAP(item as IPoapNft)
            : renderOAT(item as IOatNft)
        )}
      </Grid>
    </Grid>
  )
}
