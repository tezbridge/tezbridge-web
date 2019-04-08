<template>
  <div>
    
    <b-tabs pills ref="tabs">

      <b-tab :title="lang.gen_key.mnemonic" active>
        <b-form>
          <b-form-group
            :label="lang.gen_key.bits + ':'" >
            <b-input type="number" v-model.number="keys.mnemonic.bits"></b-input>
          </b-form-group>
          <b-form-group
            :label="lang.gen_key.words + ':'">
            <icon icon="sync" spin @click="refresh_words" class="refresh-btn"></icon>
            {{ keys.mnemonic.words }}
          </b-form-group>
          <b-form-group
            :label="lang.password + `(${lang.optional}):`">
            <b-input type="password" v-model.trim="keys.mnemonic.password"></b-input>
          </b-form-group>
          <b-form-group
            v-if="keys.mnemonic.password"
            :label="lang.password_confirm + ':'">
            <b-input type="password" v-model.trim="keys.mnemonic.password_confirm"></b-input>
          </b-form-group>
          <b-form-group
            :label="lang.generated + ':'">
            <b-alert show variant="warning">
              {{lang.must_remember}}: 
              <b>{{lang.gen_key.words}}</b>
              <b v-if="keys.mnemonic.password">, {{lang.password }}</b>
            </b-alert>
            <key-table :keyData="mnemonic_key"></key-table>
          </b-form-group>
        </b-form>
      </b-tab>

      <b-tab :title="lang.gen_key.ed25519">
        <b-form>
          <b-form-group
            :label="lang.key.seed + ':'">
            <icon icon="sync" spin @click="refresh_ed25519" class="refresh-btn"></icon>
            {{keys.ed25519.seed}}
          </b-form-group>
          <b-form-group
            :label="lang.password + `(${lang.optional}):`">
            <b-input type="password" v-model.trim="keys.ed25519.password"></b-input>
          </b-form-group>
          <b-form-group
            v-if="keys.ed25519.password"
            :label="lang.password_confirm + ':'">
            <b-input type="password" v-model.trim="keys.ed25519.password_confirm"></b-input>
          </b-form-group>
          <b-form-group
            :label="lang.generated + ':'">
            <b-alert show variant="warning">
              {{lang.must_remember}}: 
              <b v-if="!keys.ed25519.password">{{lang.key.seed}} {{lang.or}} {{lang.key.sk}}</b>
              <b v-else>{{ lang.key.encrypted }} , {{ lang.password }}</b>
            </b-alert>
            <key-table :keyData="Object.keys(ed25519_key).length ? ed25519_key : keys.ed25519.key"></key-table>
          </b-form-group>
        </b-form>
      </b-tab>

      <b-tab :title="lang.gen_key.secp256k1">
        <b-form>
          <b-form-group
            :label="lang.key.sk + ':'">
            <icon icon="sync" spin @click="refresh_secp256k1" class="refresh-btn"></icon>
            {{keys.secp256k1.sk}}
          </b-form-group>
          <b-form-group
            :label="lang.password + `(${lang.optional}):`">
            <b-input type="password" v-model.trim="keys.secp256k1.password"></b-input>
          </b-form-group>
          <b-form-group
            v-if="keys.secp256k1.password"
            :label="lang.password_confirm + ':'">
            <b-input type="password" v-model.trim="keys.secp256k1.password_confirm"></b-input>
          </b-form-group>
          <b-form-group
            :label="lang.generated + ':'">
            <b-alert show variant="warning">
              {{lang.must_remember}}: 
              <b v-if="!keys.secp256k1.password">{{lang.key.sk}}</b>
              <b v-else>{{ lang.key.encrypted }} , {{ lang.password }}</b>
            </b-alert>
            <key-table :keyData="Object.keys(secp256k1_key).length ? secp256k1_key : keys.secp256k1.key"></key-table>
          </b-form-group>
        </b-form>
      </b-tab>

      <b-tab :title="lang.gen_key.p256">
        <b-form>
          <b-form-group
            :label="lang.key.sk + ':'">
            <icon icon="sync" spin @click="refresh_p256" class="refresh-btn"></icon>
            {{keys.p256.sk}}
          </b-form-group>
          <b-form-group
            :label="lang.password + `(${lang.optional}):`">
            <b-input type="password" v-model.trim="keys.p256.password"></b-input>
          </b-form-group>
          <b-form-group
            v-if="keys.p256.password"
            :label="lang.password_confirm + ':'">
            <b-input type="password" v-model.trim="keys.p256.password_confirm"></b-input>
          </b-form-group>
          <b-form-group
            :label="lang.generated + ':'">
            <b-alert show variant="warning">
              {{lang.must_remember}}: 
              <b v-if="!keys.p256.password">{{lang.key.sk}}</b>
              <b v-else>{{ lang.key.encrypted }} , {{ lang.password }}</b>
            </b-alert>
            <key-table :keyData="Object.keys(p256_key).length ? p256_key : keys.p256.key"></key-table>
          </b-form-group>
        </b-form>
      </b-tab>

    </b-tabs>

    <b-button variant="primary" @click="use_this_key">{{lang.gen_key.use_this_key}}</b-button>
  </div>
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
        last_encrypted: '',
        mnemonic: {
          bits: 128,
          words: '',
          password: '',
          password_confirm: ''
        },
        ed25519: {
          seed: '',
          key: {},
          password: '',
          password_confirm: ''
        },
        secp256k1: {
          sk: '',
          key: {},
          password: '',
          password_confirm: ''
        },
        p256: {
          sk: '',
          key: {},
          password: '',
          password_confirm: ''
        }
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
    },
    'keys.secp256k1.password'(v : string) {
      if (!v)
        this.keys.secp256k1.password_confirm = ''
    },
    'keys.p256.password'(v : string) {
      if (!v)
        this.keys.p256.password_confirm = ''
    }
  },
  mounted() {
    this.refresh_words()
    this.refresh_ed25519()
    this.refresh_secp256k1()
    this.refresh_p256()
  },
  methods: {
    use_this_key() {
      const tab_mapping = [
        this.keys.mnemonic.words, 
        this.keys.ed25519.seed,
        this.keys.secp256k1.sk,
        this.keys.p256.sk
      ]

      const index = this.$refs.tabs.tabs.reduce((acc, x, index) => {
        if (x.show)
          return index
        else
          return acc
      }, -1)
      this.$emit('key_selected', this.keys.last_encrypted || tab_mapping[index])
    },
    refresh_words() {
      this.keys.mnemonic.words = TBC.crypto.genMnemonic(this.keys.mnemonic.bits)
    },
    refresh_ed25519() {
      const seed = TBC.crypto.genRandomBytes(32)
      this.keys.ed25519.seed = TBC.codec.bs58checkEncode(seed, TBC.codec.prefix.ed25519_seed)
    },
    refresh_secp256k1() {
      const sk = TBC.crypto.genRandomBytes(32)
      this.keys.secp256k1.sk = TBC.codec.bs58checkEncode(sk, TBC.codec.prefix.secp256k1_secret_key)
    },
    refresh_p256() {
      const sk = TBC.crypto.genRandomBytes(32)
      this.keys.p256.sk = TBC.codec.bs58checkEncode(sk, TBC.codec.prefix.p256_secret_key)
    },
    gen_key(scheme : 'ed25519' | 'secp256k1' | 'p256', key : Object, seed? : string) {
      const scheme_key = this.keys[scheme]

      if (scheme_key.password !== scheme_key.password_confirm)
        return {error: lang.password_not_match}

      const basic = {
        seed,
        pkh: key.address,
        sk: key.getSecretKey(),
        pk: key.getPublicKey()
      }

      if (scheme_key.password) {
        const raw_key = seed ? TBC.codec.bs58checkDecode(seed) : key.secret_key
        TBC.crypto.encryptKey(scheme, raw_key, scheme_key.password)
        .then(encrypted => {
          this.keys.last_encrypted = encrypted
          scheme_key.key = Object.assign({}, basic, {encrypted})
        })
        return {}
      } else {
        return basic
      }
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
    ed25519_key() {
      const seed = this.keys.ed25519.seed
      if (!seed)
        return {error: ' '}

      const key = TBC.crypto.getKeyFromSeed(TBC.codec.bs58checkDecode(seed))
      return this.gen_key('ed25519', key, seed)
    },
    secp256k1_key() {
      if (!this.keys.secp256k1.sk)
        return {error: ' '}

      const key = TBC.crypto.getKeyFromSecretKey(this.keys.secp256k1.sk)
      return this.gen_key('secp256k1', key)
    },
    p256_key() {
      if (!this.keys.p256.sk)
        return {error: ' '}

      const key = TBC.crypto.getKeyFromSecretKey(this.keys.p256.sk)
      return this.gen_key('p256', key)
    }
  }
}
</script>

<style scoped>
  .refresh-btn {cursor: pointer}
</style>