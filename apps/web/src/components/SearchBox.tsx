import React, { useEffect, useState } from 'react'
import {
  Autocomplete,
  Chip,
  CircularProgress,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'
import useWallet from '@utils/useWallet'
import { IUser } from '@app/constants'
import { formatAddress } from '@utils/helper'
import SearchIcon from '@mui/icons-material/Search'
import Link from 'next/link'
import { useDebounce } from 'usehooks-ts'

type SearchBoxProps = {
  recipientWalletAddress?: string
  id?: string
  name?: string
  className?: string
  placeholder?: string
  onSubmit?: (address: string) => Promise<void>
}

const SearchBox = ({ id, name, placeholder, onSubmit, ...props }: SearchBoxProps): JSX.Element => {
  const color = useTheme().palette
  const [loading, setLoading] = useState<boolean>(false)
  const [value, setValue] = useState<string>('')
  const debounceValue = useDebounce(value)
  const [options, setOptions] = useState<Array<IUser>>([])
  const { resolveName, lookupAddress } = useWallet()

  useEffect(() => {
    async function fetchOptions() {
      if (debounceValue.length < 5) {
        setOptions([])
        return
      }

      try {
        setLoading(true)
        if (debounceValue.startsWith('0x') && debounceValue.length === 42) {
          const domain = await lookupAddress(debounceValue)
          setOptions([
            {
              domain: domain || '',
              address: debounceValue,
            },
          ])
        } else if (debounceValue.endsWith('.eth')) {
          const address = await resolveName(debounceValue)
          if (address) {
            setOptions([
              {
                domain: debounceValue,
                address: address,
              },
            ])
          } else {
            throw new Error('Address not found')
          }
        } else {
          throw new Error('Not met searching criteria')
        }
      } catch (_) {
        setOptions([])
      } finally {
        setLoading(false)
      }
    }

    fetchOptions()
  }, [debounceValue])

  const handInputChanged = async (event: any, newValue: string) => {
    setValue(newValue)
  }

  return (
    <Stack direction={'column'} width={320} {...props}>
      <Autocomplete
        freeSolo
        fullWidth
        disableListWrap
        options={options}
        filterOptions={(x) => x}
        filterSelectedOptions
        loading={loading}
        open={value.length > 4}
        renderInput={(params) => (
          <TextField
            sx={{
              '& label.Mui-focused': {
                color: color.secondary.main,
              },
              '& label': {
                color: color.secondary.main,
              },
              '& input': {
                color: color.white.main,
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: color.secondary.main,
                },
                '&:hover fieldset': {
                  borderColor: color.secondary.main,
                },
                '&.Mui-focused fieldset': {
                  borderColor: color.secondary.main,
                },
              },
            }}
            margin="dense"
            placeholder="Search Wallet Address or ENS"
            variant="outlined"
            {...params}
            size="small"
            fullWidth
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="secondary" />
                </InputAdornment>
              ),
              endAdornment: (
                <React.Fragment>
                  {loading ? <CircularProgress color="secondary" /> : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        )}
        onInputChange={handInputChanged}
        getOptionLabel={(options) => (typeof options === 'string' ? options : options?.address)}
        renderOption={(props, option) => {
          return (
            <li {...props}>
              <Link href={`/users/${option.address}`} passHref key={option.address}>
                <a>
                  <Stack direction={'column'}>
                    {option.domain ? <Chip label={option.domain} /> : null}
                    <Typography color={color.black.main}>{formatAddress(option.address)}</Typography>
                  </Stack>
                </a>
              </Link>
            </li>
          )
        }}
      />
    </Stack>
  )
}

export default SearchBox
