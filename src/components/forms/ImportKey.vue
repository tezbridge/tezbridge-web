<template>
  <b-form>
    <b-form-group 
      :label="lang.form_import.label" 
      :description="lang.form_import.desc"
      :invalid-feedback="lang.form_import.user_key_invalid + key_type"
      :valid-feedback="lang.form_import.user_key_valid + key_type">
      <b-form-input id="user-key" v-model="user_key" :state="user_key_validation"/>
    </b-form-group>

    <b-form-group v-if="pwd_required" :label="lang.form_import.pwd_label" :description="lang.form_import.pwd_desc">
      <b-form-input  />
    </b-form-group>

  </b-form>
</template>

<script>
// @flow

import lang from '../../langs'
import TBC from 'tezbridge-crypto'

export default {
  data() {
    return {
      lang,
      user_key: '',
      key_type: '',
      pwd_required: false
    }
  },
  watch: {
    user_key(v : string) {
    }    
  },
  computed: {
    user_key_validation() {
      const user_key = this.user_key.trim()

      if (!user_key)
        return null

      try {

        const prefix = TBC.codec.bs58checkPrefixPick(user_key)
        this.key_type = prefix.name

        const scheme_require_pwd = new Set([
          'ed25519_encrypted_seed', 'secp256k1_encrypted_secret_key',
          'p256_encrypted_secret_key'
        ])
        const scheme_not_require_pwd = new Set([
          'ed25519_secret_key', 'ed25519_seed', 
          'secp256k1_secret_key', 'p256_secret_key'
        ])

        if (scheme_require_pwd.has(prefix.name))
          this.pwd_required = true
        else if (scheme_not_require_pwd.has(prefix.name)) 
          this.pwd_required = false
        else {
          return false
        }

        return true
        
      } catch(e) {

        try {
          const faucet = JSON.parse(user_key)
          if (faucet.mnemonic && faucet.password && faucet.secret) {
            const key = TBC.crypto.getKeyFromWords(faucet.mnemonic, faucet.password)
            this.key_type = lang.key.faucet
            this.pwd_required = false
            return true
          }

        } catch(e) {

          try {

            if (user_key.split(/\s+/g).length >= 12) {
              TBC.crypto.getKeyFromWords(user_key)
              this.key_type = lang.key.mnenomic
              this.pwd_required = true
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