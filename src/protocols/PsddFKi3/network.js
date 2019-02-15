// @flow

import TBN from 'tezbridge-network'

export const network_client = new TBN({
  host: 'https://testnet.tezbridge.com'
})

export default {
	network_client
}