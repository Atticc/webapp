export interface IPoapNft {
  event: {
    id: number
    fancy_id: string
    name: string
    event_url: string
    image_url: string
    country?: string
    city?: string
    description: string
    year: number
    start_date: string
    end_date: string
    expiry_date: string
    supply: number
  }
  tokenId: string
  owner: string
  chain: string
  created: string
}

export interface IOatNft {
  id: string
  image: string
  name: string
  description?: string
  animationURL?: string
  chain: string
}
