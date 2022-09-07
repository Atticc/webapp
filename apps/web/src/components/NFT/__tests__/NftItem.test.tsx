import { render, screen, waitForElementToBeRemoved } from '@testing-library/react'
import { NftItem } from '../NftItem'
import '@testing-library/jest-dom'
import { Nft } from '@alch/alchemy-web3'

const templateNft: Nft = {
  contract: { address: '0x042e2998a2995a349894eb2e0a0b9c8e879bd396' },
  id: {
    tokenId: '0x0000000000000000000000000000000000000000000000000000000000000001',
    tokenMetadata: { tokenType: 'erc721' },
  },
  balance: '1',
  title: '',
  description: '',
  tokenUri: {
    raw: '',
    gateway: '',
  },
  media: [{ raw: '', gateway: '' }],
  metadata: {},
  timeLastUpdated: '2022-02-07T05:08:39.229Z',
}

describe('NftItem', () => {
  it('It should render an img with UTF8 tokenUri', () => {
    const nft: Nft = {
      ...templateNft,
      tokenUri: {
        raw: 'data:application/json;utf8,{"name":"Love","created_by":"The People","description":"They ask for equal dignity in the eyes of the law. The Constitution grants them that right.","image":"https://arweave.net/8HFryd60PvyHUWV_3KjdUWkBR8KtZ8p6aBANGWzbIBw","image_url":"https://arweave.net/8HFryd60PvyHUWV_3KjdUWkBR8KtZ8p6aBANGWzbIBw"}',
        gateway: '',
      },
    }

    render(<NftItem nft={nft} />)
    const Img = screen.getByRole('img')

    expect(Img).toBeInTheDocument()
  })

  it('It should render an img with metadata', () => {
    const nft: Nft = {
      ...templateNft,
      metadata: {
        image: 'https://arweave.net/8HFryd60PvyHUWV_3KjdUWkBR8KtZ8p6aBANGWzbIBw',
        name: 'Example NFT 1',
      },
    }

    render(<NftItem nft={nft} />)
    const Img = screen.getByRole('img')

    expect(Img).toBeInTheDocument()
  })

  it('It shouldnt render an img with incorrect request', () => {
    const nft: Nft = {
      ...templateNft,
      metadata: {
        image: 'https://notexisted.com/abc.jpg',
        name: 'Example NFT 1',
      },
    }

    render(<NftItem nft={nft} />)
    const Img = screen.getByRole('img')
    waitForElementToBeRemoved(Img).catch((_) => {
      expect(Img).not.toBeInTheDocument()
    })
  })

  it('It should render an img with IPFS', () => {
    const nft: Nft = {
      ...templateNft,
      metadata: {
        image: 'ipfs://QmX2ZdS13khEYqpC8Jz4nm7Ub3He3g5Ws22z3QhunC2k58/3263',
        name: 'Example NFT 1',
      },
    }

    render(<NftItem nft={nft} />)
    const Img = screen.getByRole('img')

    expect(Img).toBeInTheDocument()
  })

  // it('It shouldnt render an title and description in tooltip', () => {
  //   const nft: Nft = {
  //     ...templateNft,
  //     metadata: {
  //       image: 'https://example.com/abc.jpg',
  //       name: 'Example NFT 1'
  //     }
  //   }

  //   render(<NftItem nft={nft} size={80} />)
  //   const Img = screen.getByRole('img')

  //   expect(Img).not.toBeInTheDocument()
  // })
})
