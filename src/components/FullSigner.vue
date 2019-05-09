<template>
  <div class="wrapper" ontouchstart>
    <nav class="link-tree">
      <tree-node title="Using signer" :change="using_signer">
        <record :data="using_signer"></record>
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
import TreeNode from './TreeNode'
import SelectManager from './SelectManager'
import Record from './Record'
import About from './About'

signer.addListener('sign', () => new Promise((resolve, reject) => {
  const result = window.confirm('do you want to sign?')
  if (result) 
    resolve()
  else
    reject('failed 1 @ ' + signer.source)
}))

signer.addListener('sign', () => new Promise((resolve, reject) => {
  const result = window.confirm('do you want to sign, really?')
  if (result) 
    resolve('signed @ ' + signer.source)
  else
    reject('failed 2 @' + signer.source)
}))

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
      using_signer: {
        [lang.signer.manager]: undefined,
        [lang.signer.source]: undefined
      } 
    }
  },
  methods: {
    async signerSet({manager, source} : {manager: Object, source: string}) {
      signer.init(manager, source)
      const key = await manager.revealKey()
      this.using_signer = {
        [lang.signer.manager]: key.address,
        [lang.signer.source]: source
      } 
    }
  }
} 
</script>

<style scoped>
.wrapper { width: 296px; }
</style>
