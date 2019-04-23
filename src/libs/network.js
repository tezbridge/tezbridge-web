// @flow

import TBN from 'tezbridge-network'

export const network_client = new TBN({
  host: 'https://alphanet.tezrpc.me'
})

export default {
  network_client
}