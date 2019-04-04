<template>
  <div>
    <div>{{pkh}}</div>
    <b-button @click="getReady">{{lang.manager.get_ready}}</b-button>
  </div>
</template>

<script>
// @flow 

import lang from '../langs'
import TBC from 'tezbridge-crypto'
import storage from '../libs/storage'

export default {
  props: ['encrypted_key', 'name'],
  data() {
    return {
      lang,
      pkh: '',
      name: '',
      box: null
    }
  },
  watch: {
    encrypted_key(box : TBC.crypto.EncryptedBox) {
      this.box = box

      box.revealKey()
      .then(key => {
        this.pkh = key.address
      })
    }
  },
  methods: {
    getReady() {
      storage.setReadyManager(this.box, this.name)
    }
  }
}
</script>