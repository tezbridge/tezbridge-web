<template>
  <div class="container" ontouchstart>
    <nav class="link-tree">
      <tree-node title="Create key" bold>
        <create-key></create-key>
      </tree-node>

      <tree-node title="Import key" bold>
        <import-key></import-key>
      </tree-node>

      <tree-node title="Local managers" :change="managers" bold>
        <select-manager :managers="managers"></select-manager>
      </tree-node>

      <tree-node title="Settings" bold>
        <settings></settings>
      </tree-node>

      <tree-node title="Tools" bold>
        <a class="link" :href="'/index.html?signer'">Signer</a>
        <a class="link" :href="'/playground.html'">Playground</a>
      </tree-node>
      
      <tree-node title="Error logs" bold :change="errors">
        <errors></errors>
      </tree-node>

      <tree-node title="About" bold>
        <about></about>
      </tree-node>
    </nav>

    <div class="copyright">
      <span>© 2018-2019</span> <span class="logo">TezBridge</span> 
    </div>
  </div>
</template>

<script>
// @flow

import TreeNode from './TreeNode'
import CreateKey from './CreateKey'
import ImportKey from './ImportKey'
import SelectManager from './SelectManager'
import Settings from './Settings'
import Errors from './Errors'
import About from './About'

import storage from '../libs/storage'

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
      errors: window.errors,
      managers: storage.managers
    }
  },
  methods: {
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