<template>
  <b-form>
    <b-form-group 
      :label="lang.form_import_label" 
      :description="lang.form_import_desc"
      invalid-feedback="Invalid"
      valid-feedback="Valid">
      <b-form-input id="user-key" v-model="user_key" :state="user_key_validation"/>
    </b-form-group>

    <b-form-group :label="lang.form_import_pwd_label" :description="lang.form_import_pwd_desc">
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
      user_key: ''
    }
  },
  watch: {
    user_key(v : string) {
    }    
  },
  computed: {
    user_key_validation() {
      try {
        if (!this.user_key)
          return null

        const prefix = TBC.codec.bs58checkPrefixPick(this.user_key)
        return true
      } catch {}
      return false
    }
  }
}
</script>