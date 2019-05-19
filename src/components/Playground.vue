<template>
  <div class="selectable">
    <h1>TezBridge playground for developers</h1>

    <div class="block" v-for="(title, k) in desc">
      <prism-editor class="editor" v-model="codes[k]" language="js"></prism-editor>
      <button @click="runCode(k)">{{title}}</button>
      <pre class="output">{{output[k]}}</pre>
    </div>
    
  </div>
</template>

<script>
// @flow

import "prismjs"
import "prismjs/themes/prism-solarizedlight.css"
import PrismEditor from 'vue-prism-editor'
import SmInput from './SmInput'

import lang from '../langs'

export default {
  components: {
    PrismEditor,
    SmInput
  },
  data() {
    return {
      desc: lang.signer.methods,
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
  delegate: 'tz...'    // The tz address of any baker
})
.then(result => output(result))
.catch(err => output(err))
`,
        raw_sign:
`tezbridge.request({
  method: 'raw_sign',
  bytes: ''    // Any operation bytes as string
})
.then(result => output(result))
.catch(err => output(err))
`,
        raw_inject:
`tezbridge.request({
  method: 'raw_inject',
  bytes: ''    // Any operation bytes with signature
})
.then(result => output(result))
.catch(err => output(err))
`, 
        inject_operations:
`tezbridge.request({
  method: 'inject_operations',
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
        raw_sign: '',
        raw_inject: '',
        inject_operations: ''
      }
    }
  },
  methods: {
    runCode(key : string) {
      this.output[key] = ''
      eval(`const output = x => this.output['${key}'] = x;\n${this.codes[key]}`)
    }
  },
  mounted() { 
  }
}
</script>

<style scoped>
h1 {text-align: center; line-height: 2rem}
.block {margin: 16px;}
pre.output {padding: 8px; border: 1px dotted #aaa;}
pre.output:before {font-family: consolas, Menlo, monospace; color: #aaa; content: "OUTPUT:"; display: block;}
</style>

<style>
.editor code {line-height: 1.2rem; font-size: 1rem; vertical-align: baseline; font-family: consolas, Menlo, monospace;}
.editor code * {line-height: 1.2rem; font-size: 1rem; vertical-align: baseline; font-family: consolas, Menlo, monospace;}
</style>