<template>
  <div>
    <sm-input class="element" :title="lang.general.password" :optional="true" important kind="password" v-model="password"></sm-input>
    <div class="op-panel element">
      <button @click="newKey">
        <icon icon="sync" spin size="sm"></icon>
        {{lang.general.refresh}}
      </button>
    </div>
    <record :data="key_info"></record>
  </div>
</template>

<script>
// @flow

import TBC from 'tezbridge-crypto'
import lang from '../../langs'
import { debounce } from '../../libs/util'

import Record from '../Record'
import Switcher from '../Switcher'
import SmInput from '../SmInput'

export default {
  components: {
    Record,
    SmInput,
    Switcher
  },
  data() {
    return {
      lang,
      key_info: {},
      key: null,
      password: ''
    }
  },
  watch: {
    password: debounce(function() { this.refresh() }),
    key: debounce(function() { this.refresh() })
  },
  methods: {
    newKey() {
      this.key = TBC.crypto.genRandomKey('secp256k1')
    },
    async refresh() {
      const info = {} 

      if (this.password) {
        const encrypted = await TBC.crypto.encryptKey('secp256k1', this.key.secret_key, this.password)
        Object.assign(info, {
          [this.lang.key.encrypted]: [encrypted]
        })
      } else {
        Object.assign(info, {
          [this.lang.key.sk]: [this.key.getSecretKey()]
        })
      }

      Object.assign(info, {
        [this.lang.key.pkh]: this.key.address,
        [this.lang.key.pk]: this.key.getPublicKey()
      })

      this.key_info = info
    }
  },
  mounted() {
    this.newKey()
  }
}
</script>

<style scoped>
  
</style>