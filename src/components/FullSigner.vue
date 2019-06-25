<template>
  <div class="container" ontouchstart>
    <div v-if="!protocol_js_loaded" class="protocol-loading">
      {{lang.settings.loading_protocol}}
      <loading></loading>
    </div>
    <nav class="link-tree" v-else>
      <tree-node :title="lang.menu.dapp_requests" :change="operations" :change1="curr_signer" bold>
        <record :data="curr_signer"></record>
        <requests :operations="operations"></requests>
      </tree-node>

      <tree-node :title="lang.menu.local_managers" bold>
        <tree-node :title="lang.menu.import_key" bold>
          <import-key></import-key>
        </tree-node>
        <select-manager :managers="managers" @signer_set="localSignerInit" :is_signer="true"></select-manager>
      </tree-node>

      <tree-node :title="lang.menu.remote_bridging" bold hard_close>
        <!-- <remote-bridging></remote-bridging> -->
        <simple-bridging></simple-bridging>
      </tree-node>

      <tree-node :title="lang.menu.temp_signer" bold>
        <import-key :is_temp="true" @temp_manager_confirmed="addTempManager"></import-key>
        <select-manager :managers="temp_managers" @signer_set="localSignerInit" :is_signer="true"></select-manager>
      </tree-node>

      <tree-node :title="lang.menu.settings" bold>
        <settings></settings>
      </tree-node>
      
      <tree-node :title="lang.menu.tools" bold>
        <a class="link" :href="'/index.html'">{{lang.tools.home}}</a>
        <a class="link" :href="'/playground.html'">{{lang.tools.playground}}</a>
        <a class="link" :href="'/legacy/index.html'">{{lang.tools.legacy}}</a>
      </tree-node>

      <tree-node :title="lang.menu.error_logs" bold :change="errors">
        <errors></errors>
      </tree-node>

      <tree-node :title="lang.menu.about" bold>
        <about></about>
      </tree-node>

      <div class="copyright">
        <span>© 2018-2019</span> <span class="logo">TezBridge</span> 
      </div>
    </nav>
  </div>
</template>

<script>
// @flow

declare var TBC : any

import lang from '../langs'

import signer from './Signer.js'

import TreeNode from './TreeNode'
import SelectManager from './SelectManager'
import ImportKey from './ImportKey'
import Requests from './Requests'
import Record from './Record'
import About from './About'
import RemoteBridging from './RemoteBridging'
import SimpleBridging from './SimpleBridging'
import Errors from './Errors'
import Settings from './Settings'

import storage from '../libs/storage'
import { loadProtocolJS } from '../libs/network'

export default {
  components: {
    TreeNode,
    SelectManager,
    Errors,
    ImportKey,
    RemoteBridging,
    SimpleBridging,
    Requests,
    Record,
    Settings,
    About
  },
  data() {
    return {
      lang,
      errors: window.errors,
      protocol_js_loaded: false,
      managers: storage.managers,
      temp_managers: [],
      curr_signer: {
        [lang.signer.manager]: undefined,
        [lang.signer.source]: undefined
      },
      operations: []
    }
  },
  methods: {
    async addTempManager(key : Object) {
      const box = new TBC.crypto.EncryptedBox(key.getSecretKey())
      const enc = await box.show()

      this.temp_managers.push({
        name: key.address,
        enc
      })
    },
    async localSignerInit({manager, source} : {manager: Object, source: string}) {
      signer.initLocal(manager, source)
      const key = await manager.revealKey()
      this.curr_signer = {
        [lang.signer.manager]: key.address,
        [lang.signer.source]: source
      } 
    }
  },
  async mounted() {
    await loadProtocolJS()
    this.protocol_js_loaded = true

    signer.addListener(signer.ask_methods, op => 
      new Promise((resolve, reject) => {
        this.operations.push({
          processing: false,
          op,
          resolve,
          reject
        })
      })
    )
  }
} 
</script>

<style scoped>
.container {margin-right: 4px;}
.copyright {margin: 8px 0 0 -1px; font-size: 0.8rem; color: #ccc;}
.copyright * {vertical-align: baseline;}
.logo {font-family: 'Dancing Script'; font-weight: 700; font-size: 1rem; color: #777;}
a.link { margin: 4px 0; display: block; color: #555;}
a.link:visited {color: #555;}
a.link:active {color: #555;}
</style>
