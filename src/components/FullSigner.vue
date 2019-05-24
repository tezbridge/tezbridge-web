<template>
  <div class="container" ontouchstart>
    <nav class="link-tree">
      <tree-node title="Requests" :change="operations" :change1="curr_signer" bold>
        <record :data="curr_signer"></record>
        <requests :operations="operations"></requests>
      </tree-node>

      <tree-node title="Local managers" bold>
        <select-manager :managers="managers" @signer_set="localSignerInit" :is_signer="true"></select-manager>
      </tree-node>

      <tree-node title="Remote bridging" bold>
        <remote-bridging></remote-bridging>
      </tree-node>

      <tree-node title="Temp signer" bold>
        <import-key :is_temp="true" @temp_manager_confirmed="addTempManager"></import-key>
        <select-manager :managers="temp_managers" @signer_set="localSignerInit" :is_signer="true"></select-manager>
      </tree-node>

      <tree-node title="Errors log" bold :change="errors">
        <errors></errors>
      </tree-node>

      <tree-node title="About" bold>
        <about></about>
      </tree-node>

      <div class="copyright">
        © 2018-2019 TezBridge
      </div>
    </nav>
  </div>
</template>

<script>
// @flow

import lang from '../langs'

import signer from './Signer.js'
import TBC from 'tezbridge-crypto'

import TreeNode from './TreeNode'
import SelectManager from './SelectManager'
import ImportKey from './ImportKey'
import Requests from './Requests'
import Record from './Record'
import About from './About'
import RemoteBridging from './RemoteBridging'
import Errors from './Errors'
import storage from '../libs/storage'

export default {
  components: {
    TreeNode,
    SelectManager,
    Errors,
    ImportKey,
    RemoteBridging,
    Requests,
    Record,
    About
  },
  data() {
    return {
      lang,
      errors: window.errors,
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
  mounted() {
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
</style>
