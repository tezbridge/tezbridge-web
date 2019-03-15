<template>
  <div>
    <div>{{pkh}}</div>
  </div>
</template>

<script>
// @flow 

import lang from '../langs'
import TBC from 'tezbridge-crypto'

export default {
  props: ['encrypted_key'],
  data() {
    return {
      lang,
      pkh: ''
    }
  },
  watch: {
    encrypted_key(v : TBC.crypto.EncryptedBox) {
      v.revealKey()
      .then(key => {
        this.pkh = key.address
      })
    }
  }
}
</script>