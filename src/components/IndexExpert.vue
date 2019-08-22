<template>
  <div class="container" ontouchstart>
    <div v-if="!protocol_js_loaded" class="protocol-loading">
      <span>{{lang.settings.loading_protocol}}</span>
      <b>{{network.protocol}}</b>
      <loading></loading>
    </div>
    <nav class="link-tree" v-else>
      <tree-node :title="lang.menu.create_key" bold>
        <create-key></create-key>
      </tree-node>

      <tree-node :title="lang.menu.import_key" bold>
        <import-key></import-key>
      </tree-node>

      <tree-node :title="lang.menu.local_managers" :change="managers" bold>
        <select-manager :managers="managers"></select-manager>
      </tree-node>

      <tree-node :title="lang.menu.settings" bold>
        <settings></settings>
      </tree-node>

      <tree-node :title="lang.menu.tools" bold>
        <a class="link" :href="'/index.html?signer'">{{lang.tools.signer}}</a>
        <a class="link" href="https://docs.tezbridge.com/playground.html">{{lang.tools.playground}}</a>
        <a class="link" :href="'/legacy/index.html'">{{lang.tools.legacy}}</a>
      </tree-node>
      
      <tree-node :title="lang.menu.error_logs" bold :change="errors">
        <errors></errors>
      </tree-node>
      
      <div class="copyright">
        <span>© 2018-2019</span> <span class="logo">TezBridge</span> <span>v{{version}}</span>
      </div>
    </nav>

  </div>
</template>

<script>
// @flow

import lang from '../langs'

import TreeNode from './TreeNode'
import CreateKey from './CreateKey'
import ImportKey from './ImportKey'
import SelectManager from './SelectManager'
import Settings from './Settings'
import Errors from './Errors'
import About from './About'

import storage from '../libs/storage'
import { loadProtocolJS } from '../libs/network'
import * as network from '../libs/network'

import { version } from '../../package.json'

export default {
  components: {
    TreeNode,
    CreateKey,
    ImportKey,
    SelectManager,
    Settings,
    Errors,
    About
  },
  data() {
    return {
      lang,
      version,
      protocol_js_loaded: false,
      errors: window.errors,
      network,
      managers: storage.managers
    }
  },
  methods: {
  },
  async mounted() {
    await loadProtocolJS()
    this.protocol_js_loaded = true
  }
}
</script>

<style scoped>
.container {margin-right: 4px;}
.copyright {margin: 8px 0 0 0px; font-size: 0.8rem; color: #ccc;}
.copyright * {vertical-align: baseline;}
.logo {font-family: 'Dancing Script'; font-weight: 700; font-size: 1rem; color: #777;}
a.link { margin: 4px 0; display: block; color: #555;}
a.link:visited {color: #555;}
a.link:active {color: #555;}
</style>