<template>
  <div>
    <div class="block">
      <div>source: {{source}}</div>
      <div>request result: {{op}}</div>
    </div>
    <div class="block">
      <button @click="showSource">Show source address</button>
    </div>
    <div class="block">
      <sm-input class="element" title="Operation bytes" v-model="op_bytes"></sm-input>
      <button @click="signOp">Sign operations</button>
    </div>
    <div class="block">
      <sm-input class="element" title="Operation bytes with signature" v-model="op_bytes_with_sig"></sm-input>
      <button @click="injectOp">Inject operations</button>
    </div>
    <div class="block">
      {{operation}}
      <br>
      <button @click="signInjectOp">Auto sign and inject operations</button>
    </div>
  </div>
</template>

<script>
// @flow

import SmInput from './SmInput'
const tezbridge = window.tezbridge

export default {
  components: {
    SmInput
  },
  data() {
    return {
      op_bytes: '',
      op_bytes_with_sig: '',
      operation: [
        {
          kind: 'transaction',
          amount: '10',
          destination: 'tz2L2HuhaaSnf6ShEDdhTEAr5jGPWPNwpvcB'
        },
        {
          kind: 'origination',
          balance: '5',
          spendable: true,
          delegatable: false,
          script: {
            code: [{"prim":"parameter","args":[{"prim":"contract","args":[{"prim":"unit"}],"annots":[":X"]}]},{"prim":"storage","args":[{"prim":"unit"}]},{"prim":"code","args":[[{"prim":"CDR","annots":["@storage_slash_1"]},{"prim":"NIL","args":[{"prim":"operation"}]},{"prim":"PAIR"}]]}],
            storage: {"prim":"Unit"}
          }
        }
      ],
      source: '',
      op: {}
    }
  },
  methods: {
    async showSource() {
      this.source = await tezbridge.request({method: 'get_source'})
    },
    async signOp() {
      tezbridge.request({
        method: 'sign',
        bytes: this.op_bytes
      })
      .then(x => this.op = x)
      .catch(error => this.op = error)
    },
    async injectOp() {
      tezbridge.request({
        method: 'inject',
        bytes: this.op_bytes_with_sig
      })
      .then(x => this.op = x)
      .catch(error => this.op = error)
    },
    async signInjectOp() {
      tezbridge.request({
        method: 'auto_sign_inject',
        operation: this.operation
      })
      .then(x => this.op = x)
      .catch(error => this.op = error)
    }
  }
}
</script>

<style scoped>
.block {margin: 16px;}
</style>