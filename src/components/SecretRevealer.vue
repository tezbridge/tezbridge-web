<template>
  <div>
    <record :data="secret" v-if="sk"></record>
    <sm-input class="element" :placeholder="lang.general.password" :title="lang.manager.sk_reveal" kind="password" v-model="password" v-else></sm-input>
  </div>
</template>

<script>
// @flow

declare var TBC : any

import SmInput from './SmInput'
import Record from './Record'
import lang from '../langs'
import { debounce } from '../libs/util'

export default {
  components: {
    Record,
    SmInput
  },
  props: ['manager'],
  data() {
    return {
      lang,
      password: '',
      secret: {
        [lang.key.sk]: ''
      }
    }
  },
  methods: {
    setSecret(value : string) {
      this.secret[Object.keys(this.secret)[0]] = value
    }
  },
  watch: {
    password: debounce(function(pwd : string) {
      if (!pwd) return false

      const box = new TBC.crypto.EncryptedBox(this.manager.enc)
      box.reveal(pwd)
      .then(key => {
        this.password = ''
        this.setSecret(key)
        setTimeout(() => {
          this.setSecret('')
        }, 5000)
      })
      .catch(() => {})
    })
  },
  computed: {
    sk() {
      return this.secret[Object.keys(this.secret)[0]]
    }
  }
}
</script>

<style scoped>

</style>