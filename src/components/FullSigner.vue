<template>
  <div class="container" ontouchstart>
    <nav class="link-tree">
      <tree-node title="Requests" :change="operations" bold>
        <div v-for="(item, index) in operations">
          {{item.op}}
          <loading v-if="item.processing"></loading>
          <button :disabled="item.processing" @click="acceptOp(item, index)">Accept</button> 
          <button :disabled="item.processing" @click="rejectOp(item, index)">Reject</button>
        </div>
      </tree-node>
      <tree-node title="Current signer" :change="curr_signer" bold>
        <record :data="curr_signer"></record>
      </tree-node>

      <tree-node title="Temp signer" bold>
        <import-key :is_temp="true" @temp_manager_confirmed="addTempManager"></import-key>
        <select-manager :managers="temp_managers" @signer_set="signerSet" :is_signer="true"></select-manager>
      </tree-node>
      <tree-node title="Local signer" bold>
        <select-manager :managers="managers" @signer_set="signerSet" :is_signer="true"></select-manager>
      </tree-node>

      <tree-node title="Remote signer" bold>
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
import Record from './Record'
import About from './About'

import storage from '../libs/storage'

export default {
  components: {
    TreeNode,
    SelectManager,
    ImportKey,
    Record,
    About
  },
  data() {
    return {
      lang,
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
    async acceptOp(op_item : Object, index : number) {
      op_item.processing = true

      try {
        await signer.methodHandler(op_item.op, op_item.resolve)
      } catch(e) {
        op_item.reject(e)
      }

      op_item.processing = false
      this.operations.splice(index, 1)
    },
    rejectOp(op_item : Object, index : number) {
      op_item.reject('rejected')
      this.operations.splice(index, 1)
    },
    async signerSet({manager, source} : {manager: Object, source: string}) {
      signer.init(manager, source)
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
.copyright {margin: 8px 0 0 2px; font-size: 0.8rem; color: #ccc;}
</style>
