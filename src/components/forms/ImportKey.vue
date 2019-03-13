<template>
  <b-form>
    <b-form-group 
      :label="lang.import_key.label + ':'" 
      :description="lang.import_key.desc"
      :invalid-feedback="`${lang.import_key.user_key_invalid}: ${key_type}`"
      :valid-feedback="`${lang.import_key.user_key_valid}: ${key_type}`">
      <b-form-input type="password" v-model.trim="user_key" :state="user_key_validation"/>
    </b-form-group>

    <b-form-group 
      v-if="pwd_required" 
      :label="lang.password + ':'" 
      :description="lang.import_key.pwd_desc"
      :invalid-feedback="lang.import_key.password_incorrect"
      :valid-feedback="lang.import_key.password_correct">
      <b-form-input type="password" v-model="password" :state="password_validation" />
    </b-form-group>

    <b-form-group v-if="result_key" :label="lang.key.pkh + ':'">
      {{ result_key.address }}
    </b-form-group>

  </b-form>
</template>

<script>
// @flow

import lang from '../../langs'
import TBC from 'tezbridge-crypto'


const scheme_require_pwd = new Set([
  'ed25519_encrypted_seed', 'secp256k1_encrypted_secret_key',
  'p256_encrypted_secret_key'
])
const scheme_not_require_pwd = new Set([
  'ed25519_secret_key', 'ed25519_seed', 
  'secp256k1_secret_key', 'p256_secret_key'
])

export default {
  data() {
    return {
      lang,
      user_key: '',
      key_type: '',
      password: '',
      result_key: null,
      pwd_required: false,
      password_validation: null
    }
  },
  watch: {
    password(p : string) {
      this.init()

      if (scheme_require_pwd.has(this.key_type)) {
        TBC.crypto.decryptKey(this.user_key, p)
        .then(key => {
          this.password_validation = true
          this.result_key = key
        })
        .catch(err => {
          this.password_validation = false
        })
      } else {
        this.result_key = TBC.crypto.getKeyFromWords(this.user_key, this.password)
      }
    }
  },
  methods: {
    init() {
      this.result_key = null
      this.password_validation = null
    }
  },
  computed: {
    user_key_validation() {
      this.init()

      if (!this.user_key)
        return null

      try {

        const prefix = TBC.codec.bs58checkPrefixPick(this.user_key)
        this.key_type = prefix.name


        if (scheme_require_pwd.has(prefix.name)) {
          this.pwd_required = true
          this.password = ''
        }
        else if (scheme_not_require_pwd.has(prefix.name)) {
          this.pwd_required = false
          this.result_key = prefix.name === 'ed25519_seed'
            ? TBC.crypto.getKeyFromSeed(this.user_key)
            : TBC.crypto.getKeyFromSecretKey(this.user_key)
        }
        else {
          return false
        }

        return true

      } catch(e) {

        try {
          const faucet = JSON.parse(this.user_key)
          if (faucet.mnemonic && faucet.password && faucet.secret) {
            this.result_key = TBC.crypto.getKeyFromWords(faucet.mnemonic, faucet.password)
            this.key_type = lang.key.faucet
            this.pwd_required = false
            return true
          }

        } catch(e) {

          try {

            if (this.user_key.split(/\s+/g).length >= 12) {
              this.result_key = TBC.crypto.getKeyFromWords(this.user_key)
              this.key_type = lang.key.mnemonic
              this.pwd_required = true
              this.password = ''
              
              return true
            }

          } catch {}

        }
      }

      this.pwd_required = false
      this.key_type = lang.key.no_scheme
      return false
    }
  }
}
</script>