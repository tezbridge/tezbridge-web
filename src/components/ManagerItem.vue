<template>
  <div>
    <div v-if="!box">
      <sm-input :title="lang.password" kind="password" v-model="password"></sm-input>
      <div v-if="!is_signer" class="op-panel element">
        <button @click="removeManager">Remove</button>
      </div>
    </div>
    <div v-else>
      <tree-node :title="address">
        <loading v-if="loading.manager"></loading>
        <record :data="manager_info"></record>
        <div v-if="is_signer" class="element">
          <button @click="useAsSigner(address)">Use as signer</button>
        </div>
      </tree-node>
      <tree-node :title="lang.manager.contracts">
        <loading v-if="loading.contracts"></loading>
        <tree-node :title="contract" @first_open="contractOpen(contract)" v-for="(item, contract) in contracts">
          <loading v-if="loading.contract_item[contract]"></loading>
          <record :data="item"></record>
          <div v-if="is_signer" class="element">
            <button :disabled="!item[lang.manager.spendable]" @click="useAsSigner(contract)">Use as signer</button>
          </div>
        </tree-node>
      </tree-node>
      <div class="element">
        <button @click="lock">Lock</button>
      </div>
    </div>
  </div>
</template>

<script>
// @flow

import TBC from 'tezbridge-crypto'
import TreeNode from './TreeNode'
import SmInput from './SmInput'
import Record from './Record'

import lang from '../langs'
import storage from '../libs/storage'
import { debounce, tz2r } from '../libs/util'
import { network_client } from '../libs/network'

export default {
  components: {
    SmInput,
    TreeNode,
    Record
  },
  props: {
    manager: Object,
    is_signer: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      lang,
      password: '',
      address: '',
      box: null,
      contracts: {},
      manager_info: {},
      loading: {
        manager: true,
        contracts: true,
        contract_item: {}
      }
    }
  },
  watch: {
    password: debounce(async function(){
      try {

        const box = new TBC.crypto.EncryptedBox(this.manager.enc)
        const key = await box.revealKey(this.password)

        await this.init(key)
      } catch {}
    })
  },
  mounted() {
    const box = new TBC.crypto.EncryptedBox(this.manager.enc)
    box.revealKey(this.password)
    .then(key => this.init(key))
    .catch(() => {})
  },
  methods: {
    async init(key : Object) {        
      this.password = ''
      this.address = key.address
      this.box = new TBC.crypto.EncryptedBox(key.getSecretKey())

      this.manager_info = {
        [this.lang.key.pkh]: this.address,
        [this.lang.manager.balance]: tz2r(await network_client.fetch.balance(this.address)) + 'ꜩ',
        [this.lang.signer.access_code]: undefined
      }
      this.loading.manager = false

      const contract_lst = await network_client.external.originated_contracts(this.address, false)
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
    useAsSigner(address : string) {
      this.$emit('signer_set', {
        manager: this.box,
        source: address
      })
    },
    genAccessCode(address : string) {
      const access_code = storage.setReadyManager(this.box, this.manager.name, address)
      if (address in this.contracts) {
        this.contracts[address][this.lang.signer.access_code] = access_code
      } else {
        this.manager_info[this.lang.signer.access_code] = access_code
      }
    },
    async contractOpen(contract : string) {
      this.loading.contract_item[contract] = true

      const info = await network_client.fetch.contract(contract)
      const balance = tz2r(info.balance) + 'ꜩ'
      const spendable = info.spendable

      this.contracts[contract] = {
        [this.lang.key.pkh]: contract,
        [this.lang.manager.spendable]: spendable,
        [this.lang.manager.balance]: balance,
        [this.lang.signer.access_code]: undefined
      }

      this.loading.contract_item[contract] = false
    },
    removeManager() {
      const result = window.confirm('Confirm to remove manager: ' + this.manager.name)
      if (result)
        storage.removeManager(this.manager.name)
    },
    lock() {
      this.resetData()
    }
  }
}
</script>

<style scoped>
</style>