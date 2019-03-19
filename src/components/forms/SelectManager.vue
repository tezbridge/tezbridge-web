<template>
  <b-form>
    <b-form-group 
      :label="lang.manager.select_manager+ ':'">
      <b-form-radio-group v-model="selected_enc" name="manager">
        <b-form-radio :value="manager.enc" v-for="manager in managers">
          <span>{{manager.name}}</span>
        </b-form-radio>
      </b-form-radio-group>
    </b-form-group>
    <b-form-group
      :label="lang.password + ':'"
      :invalid-feedback="lang.password_incorrect"
      :valid-feedback="lang.password_correct">
      <b-input type="password" v-model.trim="password" :state="encrypted_key === null ? null : !!encrypted_key"></b-input>
    </b-form-group>

    <b-button size="sm" variant="primary" :disabled="!encrypted_key" @click="confirm">{{lang.confirm}}</b-button>

  </b-form>
</template>

<script>
// @flow

import lang from '../../langs'
import TBC from 'tezbridge-crypto'
import storage from '../../libs/storage'
import { debounce } from '../../libs/util'

export default {
  data() {
    return {
      lang,
      managers: [],
      selected_enc: '',
      password: '',
      encrypted_key: null
    }
  },
  mounted() {
    this.managers = storage.managers
  },
  watch: {
    selected_enc() {
      this.encrypted_key = null
      this.password = ''
    },
    password: debounce(function(p : string) {
      if (!this.selected_enc)
        return false

      const box = new TBC.crypto.EncryptedBox(this.selected_enc)
      box.reveal(p)
      .then(raw_key => {
        this.encrypted_key = new TBC.crypto.EncryptedBox(raw_key)
      })
      .catch(() => {
        this.encrypted_key = false
      })
    })
  },
  methods: {
    confirm() {
      this.$emit('selected', this.encrypted_key)
      this.encrypted_key = null
    }
  }
}

</script>