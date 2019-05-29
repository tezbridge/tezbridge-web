<template>
  <div>
    <sm-input class="element" :title="lang.general.password" :optional="true" important kind="password" v-model="password"></sm-input>
    <div class="op-panel element">
      <button @click="newSeed">
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
      seed: '',
      password: ''
    }
  },
  watch: {
    password: debounce(function() { this.refresh() }),
    seed: debounce(function() { this.refresh() })
  },
  methods: {
    newSeed() {
      this.seed = TBC.crypto.genRandomBytes(32)
    },
    async refresh() {
      const info = {} 

      const key = TBC.crypto.getKeyFromSeed(this.seed)
      
      if (this.password) {
        const encrypted = await TBC.crypto.encryptKey('ed25519', this.seed, this.password)
        Object.assign(info, {
          [this.lang.key.encrypted]: [encrypted]
        })
      } else {
        Object.assign(info, {
          [this.lang.key.sk]: [key.getSecretKey()]
        })
      }

      Object.assign(info, {
        [this.lang.key.pkh]: key.address,
        [this.lang.key.pk]: key.getPublicKey(),
        [this.lang.key.ed25519_seed]: TBC.codec.bs58checkEncode(this.seed, TBC.codec.prefix.ed25519_seed)
      })

      this.key_info = info
    }
  },
  mounted() {
    this.newSeed()
  }
}
</script>

<style scoped>
  
</style>