<template>
  <b-tabs pills vertical>
    <b-tab :title="lang.gen_key.mnemonic" active>
      <b-form>
        <b-form-group
          :label="lang.gen_key.bits">
          <b-input type="number" v-model.number="keys.mnemonic.bits"></b-input>
        </b-form-group>
        <b-form-group
          :label="lang.gen_key.words"
          :description="lang.must_remember">
          <icon icon="sync" :spin="true" @click="refresh_words" class="refresh-btn"></icon>
          {{ keys.mnemonic.words }}
        </b-form-group>
        <b-form-group
          :label="lang.password + `(${lang.optional})`"
          :description="lang.must_remember">
          <b-input type="password" v-model.trim="keys.mnemonic.password"></b-input>
        </b-form-group>
        <b-form-group
          v-if="keys.mnemonic.password"
          :label="lang.password_confirm">
          <b-input type="password" v-model.trim="keys.mnemonic.password_confirm"></b-input>
        </b-form-group>
        <b-form-group
          :label="lang.generated">
          {{ mnemonic_pkh }}
        </b-form-group>
      </b-form>
    </b-tab>
    <b-tab :title="lang.gen_key.ed25519">
      {{ keys.ed25519 }}
    </b-tab>
    <b-tab :title="lang.gen_key.secp256k1">
      {{ keys.secp256k1 }}
    </b-tab>
    <b-tab :title="lang.gen_key.p256">
      {{ keys.p256 }}
    </b-tab>
  </b-tabs>
</template>

<script>
// @flow

import lang from '../../langs'
import TBC from 'tezbridge-crypto'

export default {
  data() {
    return {
      lang,
      keys: {
        mnemonic: {
          bits: 128,
          words: '',
          password: '',
          password_confirm: ''
        },
        ed25519: '',
        secp256k1: '',
        p256: ''
      }
    }
  },
  watch: {
    'keys.mnemonic.password'(v : string) {
      if (!v)
        this.keys.mnemonic.password_confirm = ''
    }
  },
  mounted() {
    this.keys.mnemonic.words = TBC.crypto.genMnemonic(this.keys.mnemonic.bits)

  },
  methods: {
    refresh_words() {
      this.keys.mnemonic.words = TBC.crypto.genMnemonic(this.keys.mnemonic.bits)

    }
  },
  computed: {
    mnemonic_pkh() {
      if (this.keys.mnemonic.password !== this.keys.mnemonic.password_confirm)
        return lang.password_not_match

      return TBC.crypto.getKeyFromWords(this.keys.mnemonic.words, this.keys.mnemonic.password).address
    }
  }
}
</script>

<style scoped>
  .refresh-btn {cursor: pointer}
</style>