import keccak from 'keccak'

//format the address display
export const formatAddress = (addr: string): string =>
  addr?.length > 10 && addr?.startsWith('0x') ? `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}` : addr

//check if the address is valid
export const isValidAddr = (address: string) => {
  const re = /^0x[a-fA-F0-9]{40}$/
  return address?.match(re) || false
}

export const isSameAddr = (addr1: string, addr2: string) => {
  if (isValidAddr(addr1) && isValidAddr(addr2)) {
    return addr1.toLowerCase() === addr2.toLowerCase() ? true : false
  }
  return false
}

// Replace IPFS address
export const replaceIPFS = (url: string = '') => {
  return url
    .replace('ipfs://ipfs/', 'https://ipfs.io/ipfs/') // case: ipfs://ipfs/xyz/image.png
    .replace('ipfs://', 'https://ipfs.io/ipfs/') // case: ipfs://xyz/1.gif
}

// decode tokenUri (base64/utf8)
export const decodeNftTokenUri = (data: string = '') => {
  try {
    const [header, ...body] = data.split(',')
    const [_, encoding] = header.split(';')
    const content = Buffer.from(body.toString(), encoding as BufferEncoding).toString()
    return JSON.parse(content)
  } catch (err: any) {
    console.warn(err.message)
    return {}
  }
}

export const formatDate = (d: Date | undefined): string => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }

  return d ? d.toLocaleDateString('en-US', options) : ''
}

export const formatTime = (d: Date | undefined): string =>
  d
    ? d.toLocaleTimeString(undefined, {
        hour12: false,
        hour: 'numeric',
        minute: '2-digit',
      })
    : ''

export const stripHexPrefix = (value: string): string => {
  return value.slice(0, 2) === '0x' ? value.slice(2) : value
}

export const toChecksumAddress = (address: string, chainId: string | null = null): string => {
  if (typeof address !== 'string') {
    return ''
  }
  try {
    if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
      throw new Error(`Given address "${address}" is not a valid Ethereum address.`)
    }

    const stripAddress = stripHexPrefix(address).toLowerCase()
    const prefix = chainId != null ? chainId.toString() + '0x' : ''
    const keccakHash = keccak('keccak256')
      .update(prefix + stripAddress)
      .digest('hex')
    let checksumAddress = '0x'

    for (let i = 0; i < stripAddress.length; i++) {
      checksumAddress += parseInt(keccakHash[i], 16) >= 8 ? stripAddress[i].toUpperCase() : stripAddress[i]
    }

    return checksumAddress
  } catch (_) {
    return address
  }
}

export function renameFile(originalFile: File, newName: string) {
  return new File([originalFile], newName, {
    type: originalFile.type,
    lastModified: originalFile.lastModified,
  })
}
