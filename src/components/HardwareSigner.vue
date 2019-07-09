<template>
  <div>
    <button @click="connectLedger">Connect Ledger</button>
  </div>
</template>

<script>
// @flow 
declare var TBC : any

import LedgerTransport from '@ledgerhq/hw-transport-u2f'
import LedgerTezos from '../libs/hw-app-xtz'

export default {
  data() {
    return {

    }
  },
  methods: {
    async connectLedger() {
      const transport = await LedgerTransport.create()
      const xtz = new LedgerTezos(transport)
      const result = await xtz.getAddress(`44'/1729'/0'/0'`, true)
      const key = new TBC.crypto.Key('ed25519', new Uint8Array([]), result.publicKey.slice(1))
      console.log(key.address)
    }
  }
}
</script>