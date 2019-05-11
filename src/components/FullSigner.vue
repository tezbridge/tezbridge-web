<template>
  <div class="wrapper" ontouchstart>
    <nav class="link-tree">
      <tree-node title="Requests" :change="operations">
        <div v-for="(item, index) in operations">
          {{item.op}}
          <loading v-if="item.processing"></loading>
          <button :disabled="item.processing" @click="acceptOp(item, index)">Accept</button> 
          <button :disabled="item.processing" @click="rejectOp(item, index)">Reject</button>
        </div>
      </tree-node>
      <tree-node title="Current signer" :change="curr_signer">
        <record :data="curr_signer"></record>
      </tree-node>

      <tree-node title="Local signer">
        <select-manager @signer_set="signerSet" :is_signer="true"></select-manager>
      </tree-node>

      <tree-node title="Remote signer">
      </tree-node>

      <tree-node title="About TezBridge">
        <about></about>
      </tree-node>
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
import Record from './Record'
import About from './About'

export default {
  components: {
    TreeNode,
    SelectManager,
    Record,
    About
  },
  data() {
    return {
      lang,
      curr_signer: {
        [lang.signer.manager]: undefined,
        [lang.signer.source]: undefined
      },
      operations: []
    }
  },
  methods: {
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
      op_item.reject('rejected @ ' + signer.source)
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
.wrapper { width: 304px; }
</style>
