<template>
  <div>
    <sm-input :title="lang.settings.host" v-model="settings.host"></sm-input>
    <div v-if="host_error" class="error">{{lang.settings.invalid_host}}</div>
  </div>
</template>

<script>
// @flow

import SmInput from './SmInput'
import storage from '../libs/storage'
import lang from '../langs'

import { debounce } from '../libs/util'
import { network_client } from '../libs/network'

export default {
  components: {
    SmInput
  },
  data() {
    return {
      lang,
      settings: storage.settings,
      host_error: false    
    }
  },
  watch: {
    'settings.host': debounce(async function(host){
      storage.saveSettings()
      network_client.host = host
      
      try {
        await network_client.fetch.protocol()
        this.host_error = false
      } catch(e) {
        this.host_error = true
      }
    })
  }
}
</script>

<style scoped>
  
</style>