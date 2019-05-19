<template>
  <div>
    <sm-input class="element" :title="lang.import_key.your_key" v-model="user_key"></sm-input>
    <sm-input v-if="pwd_required" class="element" :title="lang.password" kind="password" v-model="password"></sm-input>

    <div v-if="pwd_required && !result_key" class="error">{{lang.password_incorrect}}</div>
    
    <div v-if="result_key && !is_temp">
      <record :data="{[lang.key.pkh]: result_key.address}"></record>
      <sm-input class="element" :title="lang.import_key.manager_name" v-model="manager_name"></sm-input>
      <div v-if="!manager_name_is_valid" class="error">{{lang.import_key.manager_name_invalid}}</div>
      <sm-input class="element" :title="lang.import_key.lock_pwd" kind="password" v-model="lock_pwd"></sm-input>

      <div class="op-panel element" v-if="manager_name_is_valid">
        <button :disabled="confirming" @click="confirm">{{lang.confirm}}</button>
      </div>
    </div>

    <div v-if="result_key && is_temp">
      <div class="op-panel element">
        <button :disabled="confirming" @click="confirmTemp">{{lang.confirm}}</button>
      </div>
    </div>

  </div>
</template>

<script>
// @flow

import TBC from 'tezbridge-crypto'
import TreeNode from './TreeNode'
import lang from '../langs'
import SmInput from './SmInput'

import Record from './Record'
import { debounce } from '../libs/util'
import storage from '../libs/storage'

import { network_client } from '../libs/network'

const scheme_require_pwd = new Set([
  'ed25519_encrypted_seed', 'secp256k1_encrypted_secret_key',
  'p256_encrypted_secret_key'
])
const scheme_not_require_pwd = new Set([
  'ed25519_secret_key', 'ed25519_seed', 
  'secp256k1_secret_key', 'p256_secret_key'
])

export default {
  components: {
    TreeNode,
    Record,
    SmInput
  },
  props: {
    is_temp: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      lang,
      user_key: '',
      key_type: '',
      pwd_required: false,
      password: '',
      result_key: null,
      manager_name: '',
      lock_pwd: '',
      confirming: false
    }
  },
  watch: {
    password: debounce(function(p : string) {
      this.result_key = null

      if (scheme_require_pwd.has(this.key_type)) {
        TBC.crypto.decryptKey(this.user_key, p)
        .then(key => {
          this.result_key = key
        })
        .catch(err => {
        })
      } else {
        this.result_key = TBC.crypto.getKeyFromWords(this.user_key, this.password)
      }
    }),
    user_key: debounce(function() {
      this.result_key = null

      try {
        const prefix = TBC.codec.bs58checkPrefixPick(this.user_key)
        this.key_type = prefix.name

        if (scheme_require_pwd.has(prefix.name)) {
          this.pwd_required = true
          this.password = ''
        } else if (scheme_not_require_pwd.has(prefix.name)) {
          this.pwd_required = false
          this.result_key = prefix.name === 'ed25519_seed'
            ? TBC.crypto.getKeyFromSeed(this.user_key)
            : TBC.crypto.getKeyFromSecretKey(this.user_key)
        }
      } catch(e) {
        try {
          const faucet = JSON.parse(this.user_key)
          if (faucet.mnemonic && faucet.password && faucet.email && faucet.secret) {
            this.result_key = TBC.crypto.getKeyFromWords(faucet.mnemonic.join(' '), faucet.email + faucet.password)
            this.key_type = lang.key.faucet
            this.pwd_required = false
          }
        } catch(e) {
          try {
            if (this.user_key.split(/\s+/g).length >= 12) {
              this.result_key = TBC.crypto.getKeyFromWords(this.user_key)
              this.key_type = lang.key.mnemonic
              this.pwd_required = true
              this.password = ''
            }
          } catch(e) {
            this.pwd_required = false
            this.key_type = lang.key.no_scheme
          }
        }
      }
    })
  },
  methods: {
    async activateAccount() {
      if (this.key_type !== lang.key.faucet)          
        return false

      const balance = await network_client.fetch.balance(this.result_key.address)
      if (balance === '0') {
        this.confirming = true
        const faucet = JSON.parse(this.user_key)
        const branch = await network_client.fetch.hash()
        const protocol = await network_client.fetch.protocol()
        const ops = [{
          kind: 'activate_account',
          secret: faucet.secret,
          pkh: this.result_key.address
        }]
        const bytes = await network_client.submit.forge_operation(branch, ops)
        const sig = TBC.crypto.signOperation(bytes, this.result_key.getSecretKey())
        const op_with_sig = bytes + TBC.codec.toHex(TBC.codec.bs58checkDecode(sig))
        await network_client.submit.inject_operation(op_with_sig)
        this.confirming = false
      }
    },
    async confirmTemp() {
      await this.activateAccount()

      this.$emit('temp_manager_confirmed', this.result_key)
      this.resetData()
    },
    async confirm() {
      await this.activateAccount()

      const box = new TBC.crypto.EncryptedBox(this.result_key.getSecretKey(), this.lock_pwd)
      box.show().then(enc => {
        storage.addManager({
          name: this.manager_name,
          enc
        })
        this.resetData()
      })
    }
  },
  computed: {
    manager_name_is_valid() {
      if (!this.manager_name)
        return true

      const index = storage.indexOfManager(this.manager_name)
      return index === -1
    }
  }
}
</script>

<style scoped>
</style>
