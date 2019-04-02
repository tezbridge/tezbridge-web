<template>
  <div>
    <div>{{pkh}}</div>
    <b-button @click="activate"> {{lang.manager.activate}}</b-button>
  </div>
</template>

<script>
// @flow 

import lang from '../langs'
import TBC from 'tezbridge-crypto'
import storage from '../libs/storage'

export default {
  props: ['encrypted_key'],
  data() {
    return {
      lang,
      pkh: '',
      box: null
    }
  },
  watch: {
    encrypted_key(v : TBC.crypto.EncryptedBox) {
      this.box = v

      v.revealKey()
      .then(key => {
        this.pkh = key.address
      })
    }
  },
  methods: {
    activate() {
      storage.setActiveManager(this.box)
    }
  }
}
</script>