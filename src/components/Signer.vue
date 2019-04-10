<template>
  <div class="wrapper">
    <b-form v-if="!key">
      <b-form-group 
        :label="lang.password + ':'" 
        :description="lang.import_key.pwd_desc"
        :invalid-feedback="lang.password_incorrect"
        :valid-feedback="lang.password_correct">
        <b-form-input type="password" v-model="password" :state="key === null ? null : !!key" />
      </b-form-group>
    </b-form>
    <div v-if="key">
      <div class="block">
        {{lang.signer.listening_operations}}...
      </div>
      <div class="block">
        <table>
          <tbody>
            <tr>
              <th>{{lang.operation.kind}}:</th>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
// @flow

import TBC from 'tezbridge-crypto'
import storage from '../libs/storage'
import lang from '../langs'
import { debounce } from '../libs/util'

export default {
  data() {
    return {
      lang,
      ready_manager: storage.ready_manager,
      password: '',
      key: null,      
    }
  },
  watch: {
    password: debounce(function(p : string){
      const box = new TBC.crypto.EncryptedBox(this.ready_manager.enc)
      box.revealKey(p)
      .then(key => {
        this.key = key
      })
      .catch(err => {
        this.key = false
      })
    })
  }
}
</script>

<style scoped>
div.wrapper { max-width: 960px; margin: 0 auto }
th { padding: 4px 8px; text-align: right; }
</style>