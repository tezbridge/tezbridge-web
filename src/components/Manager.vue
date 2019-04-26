<template>
  <div>
    <div class="block">
      <div class="block-title">{{lang.manager.current_manager}}:</div>
      <table>
        <tbody>
          <tr v-if="name">
            <td class="left">{{name}}:</td>
            <td>{{pkh}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="block">
      <b-spinner v-if="loading"></b-spinner>
      <b-form-radio-group v-model="selected_contract" name="contract">
        <b-form-radio :value="contract" v-for="contract in contracts">
          <span>{{contract}}</span>
        </b-form-radio>
      </b-form-radio-group>
      <div v-if="access_code">{{lang.signer.access_code}}: {{access_code}}</div>
      <b-button v-if="box" size="sm" :disabled="!selected_contract" @click="getReady">{{lang.manager.get_ready}}</b-button>
    </div>
  </div>
</template>

<script>
// @flow 

import lang from '../langs'
import TBC from 'tezbridge-crypto'
import { network_client } from '../libs/network'
import storage from '../libs/storage'

export default {
  props: ['box', 'name'],
  data() {
    return {
      lang,
      loading: false,
      pkh: '',
      access_code: '',
      selected_contract: '',
      contracts: []
    }
  },
  watch: {
    async box(box : TBC.crypto.EncryptedBox) {
      this.resetData()

      const key = await box.revealKey()
      this.pkh = key.address
      this.loading = true
      this.contracts = await network_client.external.originated_contracts(this.pkh, false)
      this.contracts.unshift(this.pkh)
      this.loading = false
    }
  },
  methods: {
    getReady() {
      this.access_code = storage.setReadyManager(this.box, this.name, this.selected_contract)
    }
  }
}
</script>

<style scoped>
td.left { text-align: right }
td {padding: 8px;}
</style>