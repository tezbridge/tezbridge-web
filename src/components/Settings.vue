<template>
  <div>
    <switcher :data="lang_lst" v-model="curr_lang"></switcher>
    <sm-input :title="lang.settings.host" v-model="settings.host"></sm-input>
    <div v-if="host_error" class="error">{{lang.settings.invalid_host}}</div>
  </div>
</template>

<script>
// @flow

import SmInput from './SmInput'
import Switcher from './Switcher'
import storage from '../libs/storage'
import lang from '../langs'
import { switchLang } from '../langs'

import { debounce } from '../libs/util'
import { network_client } from '../libs/network'

export default {
  components: {
    SmInput,
    Switcher
  },
  data() {
    return {
      lang,
      curr_lang: lang._,
      lang_lst: {
        'English': 'en_US',
        '日本語': 'ja_JP',
        '中文': 'zh_CN',
        '한국어': 'ko_KR'
      },
      settings: storage.settings,
      host_error: false    
    }
  },
  watch: {
    'curr_lang': debounce(function(lang : string) {
      switchLang(lang)
      storage.settings.language = lang
      storage.saveSettings()
    }),
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