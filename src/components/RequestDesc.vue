<template>
  <div>
    <div v-if="op.kind !== undefined">
      <label>Type:</label>
      <div>{{op.kind}}</div>
    </div>
    <div v-if="op.amount !== undefined">
      <label>Amount:</label>
      <div>{{tz2r(op.amount)}}ꜩ</div>
    </div>
    <div v-if="op.balance !== undefined">
      <label>Balance:</label>
      <div>{{tz2r(op.balance)}}ꜩ</div>
    </div>
    <div v-if="op.destination !== undefined">
      <label>Destination:</label>
      <div>{{op.destination}}</div>
    </div>
    <div v-if="op.fee !== undefined">
      <label>Fee:</label>
      <div>{{tz2r(op.fee)}}ꜩ</div>
    </div>
    <div v-if="op.gas_limit !== undefined">
      <label>Gas limit:</label>
      <div>{{op.gas_limit}}</div>
    </div>
    <div v-if="op.storage_limit !== undefined">
      <label>Storage limit:</label>
      <div>{{op.storage_limit}}</div>
    </div>
    <div v-if="op.delegatable !== undefined">
      <label>Delegatable:</label>
      <div>{{op.delegatable}}</div>
    </div>
    <div v-if="op.spendable !== undefined">
      <label>Spendable:</label>
      <div>{{op.spendable}}</div>
    </div>
    <div v-if="op.delegate !== undefined">
      <label>Delegate:</label>
      <div>{{op.delegate}}</div>
    </div>
    <div v-if="op.script !== undefined">
      <label>Script:</label>
      <div>{{op.script}}</div>
    </div>
    <div v-if="op.parameters !== undefined">
      <label>Parameters:</label>
      <div>{{op.parameters}}</div>
    </div>
    <div v-if="op.bytes !== undefined">
      <label>Bytes:</label>
      <div>{{op.bytes}}</div>
    </div>
  </div>
</template>

<script>
// @flow

import { tz2r } from '../libs/util'

export default {
  props: ['op'],
  data() {
    return {}
  },
  methods: {
    tz2r
  },
  mounted() {
  }
}
</script>

<style scoped>
* { word-break: break-word; line-height: 1rem; font-family: consolas, Menlo, monospace, TZ;}
label { margin-top: 4px; display: block; font-weight: 700 }
</style>