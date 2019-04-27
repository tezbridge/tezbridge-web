// @flow

import TBN from 'tezbridge-network'
import storage from './storage'

export const network_client = new TBN({
  host: storage.settings.host
})

export default {
  network_client
}