<template>
  <div>
    <div v-for="(item, index) in operations">
      <div class="title">Operation</div>
      <div class="content">
        {{lang.signer.methods[item.op.method]}}
        <div class="content-body">
          <request-desc :op="item.op" class="op-item" v-if="item.op.method === 'raw_inject'"></request-desc>
          <request-desc :op="item.op" class="op-item" v-if="item.op.method === 'raw_sign'"></request-desc>
          <request-desc :op="item.op" class="op-item" v-if="item.op.method === 'set_delegate'"></request-desc>
          <request-desc :op="item.op" class="op-item" v-if="item.op.method === 'create_account'"></request-desc>
          <request-desc :op="x" class="op-item" v-for="x in item.op.operations" v-if="item.op.method === 'inject_operations'"></request-desc>
        </div>
        <loading v-if="item.processing"></loading>
        <div>
          <button :disabled="item.processing" @click="acceptOp(item, index)">Accept</button> 
          <button :disabled="item.processing" @click="rejectOp(item, index)">Reject</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @flow

import signer from './Signer.js'
import lang from '../langs'
import RequestDesc from './RequestDesc'

export default {
  components: {
    RequestDesc
  },
  props: ['operations'],
  data() {
    return {
      lang
    }
  },
  methods: {
    async acceptOp(op_item : Object, index : number) {
      op_item.processing = true

      try {
        const clone = JSON.parse(JSON.stringify(op_item.op))
        await signer.methodHandler(clone, op_item.resolve)
      } catch(e) {
        op_item.reject(e)
      }

      op_item.processing = false
      this.operations.splice(index, 1)
    },
    rejectOp(op_item : Object, index : number) {
      op_item.reject('rejected')
      this.operations.splice(index, 1)
    }
  }
}
</script>

<style scoped>
div.title { font-size: 0.8rem; background: #f0f0f0; text-align: center;}
div.content { margin-bottom: 8px; font-size: 0.85rem; padding: 4px; border: 1px solid #eee;}
.op-item { border-top: 1px dotted #aaa; padding-bottom: 6px;}
</style>