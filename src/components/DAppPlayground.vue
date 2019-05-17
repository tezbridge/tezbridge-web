<template>
  <div class="selectable">
    <h1>DApp playground with TezBridge for developers</h1>

    <div class="block" v-for="(title, k) in desc">
      <textarea v-model="codes[k]"></textarea>
      <button @click="runCode(k)">{{title}}</button>
      <pre>{{output[k]}}</pre>
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
      desc: {
        get_source: 'Get source address',
        create_account: 'Create KT1 account',
        set_delegate: 'Set delegate for KT1 account',
        sign_op: 'Sign operation bytes directly',
        inject_op: 'Inject signed operation bytes',
        make_operations: 'Sign and inject operations with minimal fee'
      },
      codes: {
        get_source: 
`tezbridge.request({method: 'get_source'})
.then(address => output(address))
.catch(err => output(err))
`,
        create_account: 
`tezbridge.request({
  method: 'create_account'
})
.then(result => output(result))
.catch(err => output(err))
`,
        set_delegate:
`tezbridge.request({
  method: 'set_delegate',
  delegate: 'THE tz1 ADDRESS OF BAKER'
})
.then(result => output(result))
.catch(err => output(err))
`,
        sign_op:
`tezbridge.request({
  method: 'raw_sign',
  bytes: 'ANY OPERATION BYTES AS STRING'
})
.then(result => output(result))
.catch(err => output(err))
`,
        inject_op:
`tezbridge.request({
  method: 'raw_inject',
  bytes: this.op_bytes_with_sig
})
.then(result => output(result))
.catch(err => output(err))
`, 
        make_operations:
`tezbridge.request({
  method: 'make_operations',
  operations: [
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
  ]
})
.then(result => output(result))
.catch(err => output(err))
`
      },
      output: {
        get_source: '',
        create_account: '',
        set_delegate: '',
        sign_op: '',
        inject_op: '',
        make_operations: ''
      }
    }
  },
  methods: {
    print(content : string, key : string) {
      this.output[key] = content
    },
    runCode(key : string) {
      this.output[key] = ''
      window.output = x => this.print(x, key)
      eval(this.codes[key])
    }
  }
}
</script>

<style scoped>
h1 {text-align: center;}
textarea {width: 100%; height: 300px;}
.block {margin: 16px;}
pre {padding: 8px; border: 1px dotted #aaa;}
pre:before {font-family: consolas, Menlo, monospace; color: #aaa; content: "OUTPUT:"; display: block;}
</style>