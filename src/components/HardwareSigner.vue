<template>
  <div>
    <tree-node title="Ledger" bold>
      <sm-input class="element" :title="lang.key.derive_path" v-model="derive_path"></sm-input>
      <switcher :data="curve_map" v-model="curve"></switcher>
      <button @click="connectLedger">Connect Ledger</button>
    </tree-node>
  </div>
</template>

<script>
// @flow 

declare var TBC : any

import LedgerTransport from '@ledgerhq/hw-transport-u2f'
import LedgerTezos from '../libs/hw-app-xtz'

import TreeNode from './TreeNode'
import Switcher from './Switcher'
import SmInput from './SmInput'

import lang from '../langs'

import elliptic from 'elliptic'

export default {
  components: {
    TreeNode,
    Switcher,
    SmInput
  },
  data() {
    return {
      lang,
      curve_map: {
        Ed25519: 'ed25519',
        Secp256k1: 'secp256k1',
        P256: 'p256'
      },
      curve: 'ed25519',
      derive_path: `44'/1729'/0'/0'`
    }
  },
  methods: {
    async connectLedger() {
      const transport = await LedgerTransport.create()
      const xtz = new LedgerTezos(transport)
      const result = await xtz.getAddress(this.derive_path, true, {
        ed25519: 0,
        secp256k1: 1,
        p256: 2
      }[this.curve])

      const pub_key_mapping = {
        ed25519(response) {
          return response.slice(2, 34)
        },
        secp256k1(response) {
          const arr = Array.from(response.slice(2, 34))
          return new Uint8Array([response[65] % 2 ? 3 : 2].concat(arr))
        },
        p256(response) {
          const arr = Array.from(response.slice(2, 34))
          return new Uint8Array([response[65] % 2 ? 3 : 2].concat(arr))
        }
      }

      const key = new TBC.crypto.Key(this.curve, new Uint8Array([]), pub_key_mapping[this.curve](result))
      console.log(key.address)
    }
  }
}
</script>