<template>
  <div class="container" ontouchstart>
    <div v-if="!protocol_js_loaded" class="protocol-loading">
      <span>{{lang.settings.loading_protocol}}</span>
      <b>{{network.protocol}}</b>
      <loading></loading>
    </div>
    
    <div class="host" v-if="protocol_js_loaded">
      <host></host>
    </div>

    <nav class="link-tree" v-if="protocol_js_loaded">
      <tree-node :title="lang.menu.create_key" bold>
        <create-key></create-key>
      </tree-node>

      <tree-node :title="lang.menu.import_key" bold>
        <import-key></import-key>
      </tree-node>

      <tree-node :title="lang.menu.local_managers" :change="managers" bold>
        <select-manager :managers="managers"></select-manager>
      </tree-node>

      <!-- <tree-node :title="lang.menu.tools" bold>
        <div class="tool-item">
          <a class="link" :href="'/index.html?signer'">{{lang.tools.signer}}</a>
          <help :content="lang.help.signer"></help>        
        </div>
        <div class="tool-item">
          <a class="link" href="https://docs.tezbridge.com/playground.html">{{lang.tools.playground}}</a>
          <help :content="lang.help.playground"></help>        
        </div>
        <div class="tool-item">
          <a class="link" :href="'/legacy/index.html'">{{lang.tools.legacy}}</a>
          <help :content="lang.help.legacy"></help>        
        </div>
      </tree-node> -->
      
      <tree-node :title="lang.menu.settings" bold>
        <settings></settings>
      </tree-node>
      
      <tree-node v-if="errors.length" :title="lang.menu.error_logs" bold :change="errors">
        <errors></errors>
      </tree-node>

      <div class="links">
        <a class="link" :href="'/index.html?signer'">
          <icon icon="key" size="sm"></icon><span>{{lang.tools.signer}}</span>
        </a>
        <a class="link" target="_blank" :href="'https://docs.tezbridge.com/'">
          <icon icon="file-alt" size="sm"></icon><span>{{lang.tools.doc}}</span>
        </a>
      </div>

      <div class="copyright">
        <span>© 2018-2019</span> 
        <a href="/index.html" class="logo">TezBridge</a> 
        <ident-mark></ident-mark>
        <span>v{{version}}</span>
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
import IdentMark from './IdentMark'
import Help from './Help'
import Host from './Host'

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
    About,
    IdentMark,
    Help,
    Host
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
.copyright {margin: 0 0 0 0px; font-size: 0.8rem; color: #ccc;}
.copyright * {vertical-align: baseline;}
.logo {font-family: 'Dancing Script'; text-decoration: none; font-weight: 700; font-size: 1rem; color: #777;}
.logo:hover {color: #000;}
.logo:active {color: #000;}

.links { margin: 6px 0 0px 2px;}
a.link { font-size: 0.8rem; color: #777; text-decoration: none}
a.link:hover { color: #000;}
a.link:active {color: #777;}
a.link svg {margin-right: 2px}
a.link > * {vertical-align: baseline}

.tool-item {margin-bottom: 4px;}
</style>