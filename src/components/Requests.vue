<template>
  <div>
    <div v-for="(item, index) in operations">
      <div class="title">{{lang.requests.operation}}: {{item.op.tezbridge}}</div>
      <div class="op-content">
        {{lang.requests.methods[item.op.method]}}
        <request-desc :op="{conn_info: {protocol: network.protocol, host: host, origin: item.op.origin}}" class="op-item conn-info"></request-desc>

        <div class="content-body">
          <request-desc :op="x" class="op-item" v-for="x in item.op.operations" v-if="item.op.method === 'inject_operations'"></request-desc>
          <request-desc :op="item.op" class="op-item" v-if="item.op.method !== 'inject_operations'"></request-desc>
          <request-test-result :contents="item.test_contents"></request-test-result>
        </div>
        <div v-if="item.state.step">
          <loading></loading> 
          <span>{{item.state.step}}/{{complete_steps}}</span>
        </div>
        <div v-if="item.state.op_hash">
          <span class="check-your-ledger">{{lang.hardware.check_your_ledger}}</span> 
          <request-desc :op="item.state" class="op-item"></request-desc>
        </div>
        <div class="element">
          <button :disabled="!!(item.state.step || item.state.op_hash)" @click="testOp(item, index)" v-if="item.op.method === 'inject_operations'">{{lang.general.test}}</button> 
          <button :disabled="!!(item.state.step || item.state.op_hash)" @click="approveOp(item, index)">{{lang.general.approve}}</button> 
          <button :disabled="!!(item.state.step || item.state.op_hash)" @click="rejectOp(item, index)">{{lang.general.reject}}</button>
        </div>
      </div>
    </div>
    <tree-node :title="lang.general.responses" :change="responses">
      <div v-for="item in responses">
        <div class="result-title">{{lang.requests.operation}}: {{item.op.tezbridge}}</div>
        <div class="op-content selectable">
          {{lang.requests.methods[item.op.method]}}
          <request-desc :op="{conn_info: {protocol: item.protocol, host: item.host, origin: item.op.origin}}" class="op-item conn-info"></request-desc>

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
import RequestTestResult from './RequestTestResult'
import TreeNode from './TreeNode'

import storage from '../libs/storage'

import * as network from '../libs/network'

export default {
  components: {
    RequestDesc,
    TreeNode,
    RequestTestResult
  },
  props: ['operations'],
  data() {
    return {
      lang,
      signer,
      network,
      responses: [],
      complete_steps: 9,
      settings: storage.settings
    }
  },
  methods: {
    async testOp(op_item : Object, index : number) {
      this.complete_steps = 6

      const conn_info = {
        protocol: this.network.protocol,
        host: this.host
      }

      op_item.state.step = 6

      try {
        const clone = JSON.parse(JSON.stringify(op_item.op))
        op_item.test_contents = await signer.testOperation(clone, op_item.state)
      } catch(e) {
        op_item.test_contents = e.toString()
      }

      op_item.state.step = 0
    },
    async approveOp(op_item : Object, index : number) {
      this.complete_steps = 9

      const conn_info = {
        protocol: this.network.protocol,
        host: this.host
      }

      op_item.state.step = 9

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

      const handled = this.operations.splice(index, 1)[0]
      Object.assign(handled, conn_info)
      this.responses.unshift(handled)
    },
    rejectOp(op_item : Object, index : number) {
      const conn_info = {
        protocol: this.network.protocol,
        host: this.host
      }

      op_item.reject('rejected')
      op_item.result = 'rejected'

      const handled = this.operations.splice(index, 1)[0]
      Object.assign(handled, conn_info)
      this.responses.unshift(handled)
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
.check-your-ledger {display: inline-block; margin-top: 4px; transform: translateY(1px); padding: 2px 4px; color: white; background: black;}
.conn-info {opacity: 0.4}
</style>