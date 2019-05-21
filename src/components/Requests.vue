<template>
  <div>
    <div v-for="(item, index) in operations">
      <div class="title">Operation: {{item.op.tezbridge}}</div>
      <div class="op-content">
        {{lang.signer.methods[item.op.method]}}
        <div class="content-body">
          <request-desc :op="x" class="op-item" v-for="x in item.op.operations" v-if="item.op.method === 'inject_operations'"></request-desc>
          <request-desc :op="item.op" class="op-item" v-if="item.op.method !== 'inject_operations'"></request-desc>
        </div>
        <loading v-if="item.processing"></loading>
        <div>
          <button :disabled="item.processing" @click="approveOp(item, index)">Approve</button> 
          <button :disabled="item.processing" @click="rejectOp(item, index)">Reject</button>
        </div>
      </div>
    </div>
    <tree-node title="Results" :change="results">
      <div v-for="item in results">
        <div class="title">Operation: {{item.op.tezbridge}}</div>
        <div class="op-content">
          {{lang.signer.methods[item.op.method]}}
          <request-desc :op="x" class="op-item" v-for="x in item.op.operations" v-if="item.op.method === 'inject_operations'"></request-desc>
          <request-desc :op="item.op" class="op-item" v-if="item.op.method !== 'inject_operations'"></request-desc>
          <div class="op-result">
            <div v-if="item.result === 'approved'" class="approved">Approved</div>
            <div v-else-if="item.result === 'rejected'" class="rejected">Rejected</div>
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

export default {
  components: {
    RequestDesc,
    TreeNode
  },
  props: ['operations'],
  data() {
    return {
      lang,
      results: []
    }
  },
  methods: {
    async approveOp(op_item : Object, index : number) {
      op_item.processing = true

      try {
        const clone = JSON.parse(JSON.stringify(op_item.op))
        await signer.methodHandler(clone, op_item.resolve)
        op_item.result = 'approved'
      } catch(e) {
        op_item.reject(e)
        op_item.result = e
      }

      op_item.processing = false
      this.results.unshift(this.operations.splice(index, 1)[0])
    },
    rejectOp(op_item : Object, index : number) {
      op_item.reject('rejected')
      op_item.result = 'rejected'
      this.results.unshift(this.operations.splice(index, 1)[0])
    }
  }
}
</script>

<style scoped>
div.title { font-size: 0.8rem; background: #f0f0f0; text-align: center;}
div.op-content { margin-bottom: 8px;  font-size: 0.85rem; padding: 4px; padding-bottom: 8px; border: 1px solid #eee;}
.op-item { border-top: 1px dotted #aaa; padding-bottom: 6px;}
.op-result > div { display: inline-block; font-size: 0.8rem; line-height: 1rem; color: white; padding: 2px 4px; border-radius: 4px; }
.approved { background: #27bd1d }
.rejected { background: #bd1d1d }
.op-result .failed { color: black; border: 1px solid #bd1d1d }
</style>