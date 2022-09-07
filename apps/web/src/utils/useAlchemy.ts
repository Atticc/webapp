import { createAlchemyWeb3 } from '@alch/alchemy-web3'
import { ALCHEMY_RPC_ETH } from '@app/config'

export function useAlchemy() {
  const web3 = createAlchemyWeb3(ALCHEMY_RPC_ETH)

  return web3
}
