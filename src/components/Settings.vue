<template>
  <div>
    <tree-node :title="lang.settings.language">
      <switcher :data="lang_lst" v-model="curr_lang"></switcher>
    </tree-node>
    <tree-node :title="lang.settings.briding_mode">
      <switcher :data="bridging_lst" v-model="settings.bridging_mode"></switcher>
    </tree-node>
    <div>
      <sm-input :title="lang.settings.host" v-model="settings.host"></sm-input>
      <div v-if="host_error" class="error">{{lang.settings.invalid_host}}</div>
    </div>
  </div>
</template>

<script>
// @flow

import TreeNode from './TreeNode'

import SmInput from './SmInput'
import Switcher from './Switcher'
import storage from '../libs/storage'
import lang from '../langs'
import { switchLang } from '../langs'

import { debounce } from '../libs/util'
import { network_client, loadProtocolJS } from '../libs/network'

export default {
  components: {
    SmInput,
    TreeNode,
    Switcher
  },
  data() {
    return {
      lang,
      curr_lang: lang._,
      lang_lst: {
        'English': 'en_US',
        '中文': 'zh_CN',
        '日本語(TODO)': 'ja_JP',
        '한국어(TODO)': 'ko_KR'
      },
      bridging_lst: {
        [lang.general.simple]: 'simple',
        [lang.general.manual]: 'manual'
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
      try {
        await loadProtocolJS()

        this.host_error = false
      } catch(e) {
        this.host_error = true
      }
    }),
    'settings.bridging_mode': debounce(function(mode){
      storage.saveSettings()
    })
  }
}
</script>

<style scoped>
</style>