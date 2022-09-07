import { NODE_ENV, WEB3_STORAGE_API_TOKEN } from '@app/config'
import { Web3Storage } from 'web3.storage'

const namePrefix = 'img'

export function jsonFile(filename: string, obj: any) {
  return new File([JSON.stringify(obj)], filename)
}

export function makeGatewayURL(cid: string, path: string) {
  return `https://${cid}.ipfs.dweb.link/${encodeURIComponent(path)}`
}

export async function getImageMetadata(cid: any) {
  const url = makeGatewayURL(cid, 'metadata.json')
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`error fetching image metadata: [${res.status}] ${res.statusText}`)
  }
  const metadata = await res.json()
  const gatewayURL = makeGatewayURL(cid, metadata.path)
  const uri = `ipfs://${cid}/${metadata.path}`
  return { ...metadata, cid, gatewayURL, uri }
}

export function storeImage(client: Web3Storage) {
  return async function ({ file, address, handleUploaded }: { file: File; address: string; handleUploaded: () => {} }) {
    const uploadName = [namePrefix, address].join('|')

    const cid = await client.put([file], {
      name: uploadName,
      onRootCidReady: (localCid: string) => {
        NODE_ENV === 'development' && console.log(`> 🔑 locally calculated Content ID: ${localCid} `)
      },
      onStoredChunk: (bytes: any) => {
        NODE_ENV === 'development' && console.log(`> 🛰 sent ${bytes.toLocaleString()} bytes to web3.storage`)
        handleUploaded && handleUploaded()
      },
    })

    const imageGatewayURL = makeGatewayURL(cid, file.name)
    const imageURI = `ipfs://${cid}/${file.name}`
    return { cid, imageGatewayURL, imageURI }
  }
}
interface IWeb3Storage {
  client: Web3Storage
  upload: any
  // retrieve: any
}

export const useWeb3Storage = (): IWeb3Storage => {
  const client = new Web3Storage({ token: WEB3_STORAGE_API_TOKEN, endpoint: new URL('https://api.web3.storage') })
  if (client === undefined) {
    throw new Error('initialize Web3 Storage failure')
  }

  const upload = storeImage(client)

  return { client, upload }
}

export default useWeb3Storage
