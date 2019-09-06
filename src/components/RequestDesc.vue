<template>
  <div>
    <div v-if="op.op_hash !== undefined">
      <label>{{lang.requests.op_desc.op_hash}}:</label>
      <div>{{op.op_hash}}</div>
    </div>
    <div v-if="op.kind !== undefined">
      <label>{{lang.requests.op_desc.kind}}:</label>
      <div>{{op.kind}}</div>
    </div>
    <div v-if="op.amount !== undefined">
      <label>{{lang.requests.op_desc.amount}}:</label>
      <div>{{tz2r(op.amount)}}ꜩ</div>
    </div>
    <div v-if="op.balance !== undefined">
      <label>{{lang.requests.op_desc.balance}}:</label>
      <div>{{tz2r(op.balance)}}ꜩ</div>
    </div>
    <div v-if="op.destination !== undefined">
      <label>{{lang.requests.op_desc.destination}}:</label>
      <div>{{op.destination}}</div>
    </div>
    <div v-if="op.fee !== undefined">
      <label>{{lang.requests.op_desc.fee}}:</label>
      <div>{{tz2r(op.fee)}}ꜩ</div>
    </div>
    <div v-if="op.gas_limit !== undefined">
      <label>{{lang.requests.op_desc.gas_limit}}:</label>
      <div>{{op.gas_limit}}</div>
    </div>
    <div v-if="op.storage_limit !== undefined">
      <label>{{lang.requests.op_desc.storage_limit}}:</label>
      <div>{{op.storage_limit}}</div>
    </div>
    <div v-if="op.delegatable !== undefined">
      <label>{{lang.requests.op_desc.delegatable}}:</label>
      <div>{{op.delegatable}}</div>
    </div>
    <div v-if="op.spendable !== undefined">
      <label>{{lang.requests.op_desc.spendable}}:</label>
      <div>{{op.spendable}}</div>
    </div>
    <div v-if="op.delegate !== undefined">
      <label>{{lang.requests.op_desc.delegate}}:</label>
      <div>{{op.delegate}}</div>
    </div>
    <div v-if="op.script !== undefined">
      <label>{{lang.requests.op_desc.script}}:</label>
      <div>{{op.script}}</div>
    </div>
    <div v-if="op.parameters !== undefined">
      <label>{{lang.requests.op_desc.parameters}}:</label>
      <div>{{op.parameters}}</div>
    </div>
    <div v-if="op.bytes !== undefined">
      <label>{{lang.requests.op_desc.bytes}}:</label>
      <div>{{op.bytes}}</div>
    </div>
    <div v-if="op.host !== undefined">
      <label>{{lang.requests.op_desc.host}}:</label>
      <div>{{op.host}}</div>
    </div>
    <div v-if="parsed_ops">
      <label>{{lang.requests.op_desc.parsed_ops}}:</label>
      <pre>{{parsed_ops}}</pre>
    </div>
    <div v-if="op.signature !== undefined">
      <label>{{lang.requests.op_desc.signature}}:</label>
      <div>{{op.signature}}</div>
    </div>
    <div v-if="op.sign_bytes !== undefined">
      <label>{{lang.requests.op_desc.sign_bytes}}:</label>
      <div>{{!!op.sign_bytes}}</div>
    </div>
  </div>
</template>

<script>
// @flow

declare var TBC : any

import { tz2r } from '../libs/util'
import lang from '../langs'

export default {
  props: ['op'],
  data() {
    return {
      lang,
      parsed_ops: null
    }
  },
  methods: {
    tz2r
  },
  mounted() {
    if (this.op.method !== 'raw_inject')
      return false

    const op_bytes = this.op.signature || this.op.sign_bytes ?
      this.op.bytes :
      this.op.bytes.slice(0, -128)

    try {
      this.parsed_ops = JSON.stringify(TBC.localop.parseOperationBytes(op_bytes), null, 2)
    } catch (e){
      this.parsed_ops = e
    }
  }
}
</script>

<style scoped>
* { word-break: break-word; line-height: 1rem; font-family: consolas, Menlo, monospace, TZ;}
label { margin-top: 4px; display: block; font-weight: 700 }
pre { margin-top: 0; word-break: break-word; white-space: pre-wrap;}
</style>