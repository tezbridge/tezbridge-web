<template>
  <div class="block">
    <div class="block-title">{{lang.manager.current_manager}}:</div>
    <table>
      <tbody>
        <tr v-if="name">
          <td class="left">{{name}}:</td>
          <td>{{pkh}}</td>
        </tr>
        <tr v-if="access_code">
          <td class="left">{{lang.signer.access_code}}:</td>
          <td>{{access_code}}</td>
        </tr>
      </tbody>
    </table>
    <b-button v-if="box" size="sm" @click="getReady">{{lang.manager.get_ready}}</b-button>
  </div>
</template>

<script>
// @flow 

import lang from '../langs'
import TBC from 'tezbridge-crypto'
import storage from '../libs/storage'

export default {
  props: ['box', 'name'],
  data() {
    return {
      lang,
      pkh: '',
      access_code: ''
    }
  },
  watch: {
    box(box : TBC.crypto.EncryptedBox) {
      box.revealKey()
      .then(key => {
        this.pkh = key.address
      })
    }
  },
  methods: {
    getReady() {
      this.access_code = storage.setReadyManager(this.box, this.name)
    }
  }
}
</script>

<style scoped>
td.left { text-align: right }
td {padding: 8px;}
</style>