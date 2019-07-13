<template>
  <div>
    <tree-node title="Ledger" bold>
      <switcher :data="curve_map" v-model="curve"></switcher>
      <sm-input class="element" :title="lang.key.derive_path" v-model="derive_path"></sm-input>
      <button class="element" @click="connectLedger">{{lang.hardware.connect_ledger}}</button>

      <div v-if="key">
        <tree-node :title="key.address">
          <loading v-if="loading.manager"></loading>
          <record :data="manager_info"></record>
          <div class="element">
            <button @click="useAsSigner()">{{lang.manager.use_as_signer}}</button>
          </div>
        </tree-node>

        <tree-node :title="lang.menu.originated_accounts">
          <loading v-if="loading.contracts"></loading>
          <tree-node :title="contract" @first_open="contractOpen(contract)" v-for="(item, contract) in contracts">
            <loading v-if="loading.contract_item[contract]"></loading>
            <record :data="item"></record>
            <div class="element">
              <button :disabled="!item[lang.requests.op_desc.spendable]" @click="useAsSigner(contract)">{{lang.manager.use_as_signer}}</button>
            </div>
          </tree-node>
        </tree-node>
      </div>


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
import Record from './Record'

import lang from '../langs'

import storage from '../libs/storage'

import { debounce, tz2r } from '../libs/util'
import { network_client } from '../libs/network'

import { bs58Encode } from '../libs/util'


const curve_mapping = {
  ed25519: 0,
  secp256k1: 1,
  p256: 2
}

export default {
  components: {
    TreeNode,
    Switcher,
    SmInput,
    Record
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
      derive_path: `44'/1729'/0'/0'`,

      ledger_app: null,
      key: null,
      manager_info: {},
      contracts: {},
      loading: {
        manager: true,
        contracts: true,
        contract_item: {}
      }
    }
  },
  methods: {
    async contractOpen(contract : string) {
      this.loading.contract_item[contract] = true

      if (!network_client)
        throw `invalid network_client`

      const info = await network_client.fetch.contract(contract)
      const balance = tz2r(info.balance) + 'ꜩ'
      const spendable = info.spendable

      this.contracts[contract] = {
        [this.lang.key.pkh]: contract,
        [this.lang.requests.op_desc.spendable]: spendable,
        [this.lang.requests.op_desc.balance]: balance
      }

      this.loading.contract_item[contract] = false
    },
    async init() {
      if (!network_client)
        throw `invalid network_client`

      this.manager_info = {
        [this.lang.key.pkh]: this.key.address,
        [this.lang.requests.op_desc.balance]: tz2r(await network_client.fetch.balance(this.key.address)) + 'ꜩ'
      }
      this.loading.manager = false

      const net_type = storage.settings.host.indexOf('alphanet') > -1 ? 'alphanet' : 'mainnet'
      const contract_lst = await network_client.external.originated_contracts(this.key.address, false, net_type)
      const contracts = {}
      const loading_contract_item = {}
      contract_lst.forEach(async contract => {
        contracts[contract] = {}
        loading_contract_item[contract] = false
      })
      this.contracts = contracts
      this.loading.contracts = false
      this.loading.contract_item = loading_contract_item
    },
    useAsSigner(address? : string) {
      const watermark = TBC.codec.toHex(TBC.codec.watermark.operation())

      this.$emit('ledger_set', {
        source: address || this.key.address, 
        pub_key: this.key.getPublicKey(), 
        manager: this.key.address,
        sign: ((derive_path : string, curve : string) => async (bytes : string, state : Object) => {
          const op_bytes = watermark + bytes
          state.op_hash = bs58Encode(TBC.crypto.blake2bHash(TBC.codec.fromHex(op_bytes)))

          const sig_raw = await this.ledger_app.signOperation(derive_path, op_bytes, curve_mapping[curve])
          const sig_convert = (sig : any) => {
            const b2 = sig[3]
            const r_start = b2 === 32 ? 4 : 5
            const r = sig.slice(r_start, r_start + 32)
            const b3 = sig[4 + b2 + 1]
            const s_start = b3 === 32 ? 6 + b2 : 7 + b2
            const s = sig.slice(s_start, s_start + 32)

            return TBC.codec.bytesConcat(r, s)
          }

          const result_sig = curve === 'ed25519' ? sig_raw : sig_convert(sig_raw)

          return TBC.codec.bs58checkEncode(result_sig, {
            ed25519: TBC.codec.prefix.ed25519_signature,
            secp256k1: TBC.codec.prefix.secp256k1_signature,
            p256: TBC.codec.prefix.p256_signature
          }[curve])
        })(this.derive_path, this.curve)
      })
    },
    async connectLedger() {
      const transport = await LedgerTransport.create()
      this.ledger_app = new LedgerTezos(transport)
      const result = await this.ledger_app.getAddress(this.derive_path, true, curve_mapping[this.curve])

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

      this.key = new TBC.crypto.Key(this.curve, new Uint8Array([]), pub_key_mapping[this.curve](result))

      await this.init()
    }
  }
}
</script>