import { AssetTransfersCategory, NftFilters } from '@alch/alchemy-web3'
import { ALCHEMY_RPC_ETH } from '@app/config'
import { isValidAddr } from '@utils/helper'
import { useAlchemy } from '@utils/useAlchemy'
import axios from 'axios'
import type { NextPage } from 'next'
import { useEffect, useMemo, useState } from 'react'

//MINT, CREATE, TRANSFER, RECEIVE
const TestPage: NextPage = () => {
  const { alchemy } = useAlchemy()
  const address = '0x89FCb15Cadb447cE926613619026ABC0381622E5'
  const [trxs, setTrxs] = useState([])

  useEffect(() => {
    async function fetchNFTs() {
      let data = JSON.stringify({
        jsonrpc: '2.0',
        id: 0,
        method: 'alchemy_getAssetTransfers',
        params: [
          {
            fromBlock: '0x0',
            fromAddress: address,
            excludeZeroValue: true,
            category: ['erc721', 'erc1155'],
          },
        ],
      })

      const requestOptions = {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        data: data,
      }

      const baseURL = ALCHEMY_RPC_ETH
      const axiosURL = `${baseURL}`

      try {
        const res = await axios(axiosURL, requestOptions)
        const { result = [] } = res?.data || {}
        // console.log(res?.data)
        for (const events of res.data.result.transfers) {
          if (events.erc1155Metadata == null) {
            console.log('ERC-721 Token Minted: ID- ', events.tokenId, ' Contract- ', events.rawContract.address)
          } else {
            for (const erc1155 of events.erc1155Metadata) {
              console.log('ERC-1155 Token Minted: ID- ', erc1155.tokenId, ' Contract- ', events.rawContract.address)
            }
          }
        }
        // const res = await alchemy.getNfts({ owner: address, filters: [NftFilters.SPAM] })

        setTrxs([])
      } catch (_) {}
    }

    async function fetchTrxs() {
      const res = await alchemy.getAssetTransfers({
        fromBlock: '0x0',
        fromAddress: '0x0000000000000000000000000000000000000000',
        toAddress: address,
        excludeZeroValue: true,
        category: [AssetTransfersCategory.ERC721, AssetTransfersCategory.ERC1155],
      })

      console.log(res)
    }

    if (isValidAddr(address)) {
      fetchNFTs()
      fetchTrxs()
    } else {
      setTrxs([])
    }
  }, [address])

  return (
    <button
      type="button"
      onClick={() => {
        throw new Error('SETUP: Sentry Frontend Error')
      }}
    >
      Throw error
    </button>
  )
}

export default TestPage
