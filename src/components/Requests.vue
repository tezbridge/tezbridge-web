<template>
  <div>
    <div class="host">{{network.protocol}} @ {{host}}</div>
    <div v-for="(item, index) in operations">
      <div class="title">{{lang.requests.operation}}: {{item.op.tezbridge}}</div>
      <div class="op-content">
        {{lang.requests.methods[item.op.method]}}
        <div class="content-body">
          <request-desc :op="x" class="op-item" v-for="x in item.op.operations" v-if="item.op.method === 'inject_operations'"></request-desc>
          <request-desc :op="item.op" class="op-item" v-if="item.op.method !== 'inject_operations'"></request-desc>
        </div>
        <div v-if="item.state.step">
          <loading></loading> 
          <span>{{item.state.step}}/10</span>
          <span v-if="signer.ledger.pub_key && new Set([3,7]).has(item.state.step)">
            {{lang.hardware.check_your_ledger}}
          </span>
        </div>
        <div class="element">
          <button :disabled="!!item.state.step" @click="approveOp(item, index)">{{lang.general.approve}}</button> 
          <button :disabled="!!item.state.step" @click="rejectOp(item, index)">{{lang.general.reject}}</button>
        </div>
      </div>
    </div>
    <tree-node :title="lang.general.responses" :change="responses">
      <div v-for="item in responses">
        <div class="result-title">{{lang.requests.operation}}: {{item.op.tezbridge}}</div>
        <div class="op-content">
          {{lang.requests.methods[item.op.method]}}
          <request-desc :op="x" class="op-item" v-for="x in item.op.operations" v-if="item.op.method === 'inject_operations'"></request-desc>
          <request-desc :op="item.op" class="op-item" v-if="item.op.method !== 'inject_operations'"></request-desc>
          <div class="op-result">
            <div v-if="item.result === 'approved'" class="approved selectable">{{lang.general.approved}}: {{item.result_val}}</div>
            <div v-else-if="item.result === 'rejected'" class="rejected">{{lang.general.rejected}}</div>
            <div v-else class="failed">{{item.result}}</div>
          </div>
        </div>
      </div>
    </tree-node>
  </div>
</template>

<script>
// @flow

import signer from './Signer.js'
import lang from '../langs'
import RequestDesc from './RequestDesc'
import TreeNode from './TreeNode'

import storage from '../libs/storage'

import * as network from '../libs/network'

export default {
  components: {
    RequestDesc,
    TreeNode
  },
  props: ['operations'],
  data() {
    return {
      lang,
      signer,
      network,
      responses: [],
      settings: storage.settings
    }
  },
  methods: {
    async approveOp(op_item : Object, index : number) {
      try {
        const clone = JSON.parse(JSON.stringify(op_item.op))
        const result_val = await signer.methodHandler(clone, op_item.resolve, op_item.state)
        op_item.result = 'approved'
        op_item.result_val = result_val instanceof ProgressEvent ? 'network failed' : result_val
      } catch(e) {
        op_item.reject(e)
        op_item.result = e
      }

      op_item.state.step = 0
      this.responses.unshift(this.operations.splice(index, 1)[0])
    },
    rejectOp(op_item : Object, index : number) {
      op_item.reject('rejected')
      op_item.result = 'rejected'
      this.responses.unshift(this.operations.splice(index, 1)[0])
    }
  },
  computed: {
    host() {
      if (this.network.network_client)
        return this.network.network_client.host
      else
        return this.settings.host
    }
  }
}
</script>

<style scoped>
div.title, div.result-title { font-size: 0.8rem; background: #f0f0f0; text-align: center;}
div.op-content { margin-bottom: 8px;  font-size: 0.85rem; padding: 4px; padding-bottom: 8px; border: 1px solid #eee;}
.op-item { border-top: 1px dotted #aaa; padding-bottom: 6px;}
.op-result > div { display: inline-block; word-break: break-word; font-size: 0.8rem; line-height: 1rem; color: white; padding: 2px 4px; border-radius: 4px; }
.approved { background: #27bd1d }
.rejected { background: #bd1d1d }
.op-result .failed { background: #bd1d1d }
.host { display: inline-block; font-size: 0.8rem;  padding: 2px 6px; border-radius: 4px; margin: 4px 0; background: #fffa08 }
</style>