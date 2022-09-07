import { Stack, Typography, TypographyVariant, TypographyVariants } from '@mui/material'
import useEns from '@utils/useEns'

type AddressProps = {
  address: string
  variant?: TypographyVariant
  showAddress?: boolean
}

const shortAddress = (addr: string): string =>
  addr.length > 10 && addr.startsWith('0x') ? `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}` : addr

const Address = ({ address, variant = 'h6', showAddress = false }: AddressProps): JSX.Element => {
  const { name, loading } = useEns(address)

  return (
    <Stack direction={'column'} px={1}>
      <Typography variant={variant}>{name ?? (!showAddress ? shortAddress(address) : '')}</Typography>
      {showAddress ? <Typography variant="body1">{shortAddress(address)}</Typography> : null}
    </Stack>
  )
}

export default Address
