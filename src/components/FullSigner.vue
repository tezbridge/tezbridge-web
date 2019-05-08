<template>
  <div class="wrapper" ontouchstart>
    <nav class="link-tree">
      <tree-node title="Local signer">
        <select-manager @source_set="sourceSet" :is_signer="true"></select-manager>
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

import Signer from './Signer.js'
import TreeNode from './TreeNode'
import SelectManager from './SelectManager'
import About from './About'

export default {
  components: {
    TreeNode,
    SelectManager,
    About
  },
  data() {
    return {
      signer: null
    }
  },
  methods: {
    sourceSet({manager, source} : {manager: Object, source: string}) {
      this.signer = new Signer(manager, async function(){

      })
    }
  }
} 
</script>

<style scoped>
.wrapper { width: 296px; }
</style>
