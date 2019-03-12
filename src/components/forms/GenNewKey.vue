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
          <icon icon="sync" spin @click="refresh_words" class="refresh-btn"></icon>
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
          <key-table :keyData="mnemonic_key"></key-table>
        </b-form-group>
      </b-form>
    </b-tab>
    <b-tab :title="lang.gen_key.ed25519">
      <b-form>
        <b-form-group
          :label="lang.password + `(${lang.optional})`"
          :description="lang.must_remember">
          <b-input type="password" v-model.trim="keys.ed25519.password"></b-input>
        </b-form-group>
        <b-form-group
          v-if="keys.ed25519.password"
          :label="lang.password_confirm">
          <b-input type="password" v-model.trim="keys.ed25519.password_confirm"></b-input>
        </b-form-group>
        <b-form-group
          :label="lang.generated">
          <icon icon="sync" spin @click="refresh_ed25519" class="refresh-btn"></icon>
          {{ ed25519_sk }}
        </b-form-group>
      </b-form>
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
import KeyTable from './KeyTable'

export default {
  components: {
    KeyTable
  },
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
        ed25519: {
          password: '',
          password_confirm: ''
        },
        secp256k1: '',
        p256: ''
      }
    }
  },
  watch: {
    'keys.mnemonic.password'(v : string) {
      if (!v)
        this.keys.mnemonic.password_confirm = ''
    },
    'keys.ed25519.password'(v : string) {
      if (!v)
        this.keys.ed25519.password_confirm = ''
    }
  },
  mounted() {
    this.keys.mnemonic.words = TBC.crypto.genMnemonic(this.keys.mnemonic.bits)

  },
  methods: {
    refresh_words() {
      this.keys.mnemonic.words = TBC.crypto.genMnemonic(this.keys.mnemonic.bits)
    },
    refresh_ed25519() {

    }
  },
  computed: {
    mnemonic_key() {
      if (this.keys.mnemonic.password !== this.keys.mnemonic.password_confirm)
        return {error: lang.password_not_match}

      const seed = TBC.crypto.getSeedFromWords(this.keys.mnemonic.words, this.keys.mnemonic.password)
      const key = TBC.crypto.getKeyFromSeed(seed)

      const seed_tz = TBC.codec.bs58checkEncode(seed, TBC.codec.prefix.ed25519_seed)
      return {
        seed: seed_tz, 
        pkh: key.address, 
        sk: key.getSecretKey(),
        pk: key.getPublicKey()
      }
    },
    ed25519_sk() {
      if (this.keys.ed25519.password !== this.keys.ed25519.password_confirm)
        return lang.password_not_match

      if (!this.keys.ed25519.password)
        return TBC.crypto.genRandomKey('ed25519').getSecretKey()
      else {
         TBC.crypto.encryptKey('ed25519', TBC.crypto.genRandomBytes(32), this.key.ed25519.password)
      }
    }
  }
}
</script>

<style scoped>
  .refresh-btn {cursor: pointer}
</style>