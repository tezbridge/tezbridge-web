<template>
  <div class="wrapper" ontouchstart>
    <nav class="link-tree">
      <tree-node title="Local signer">
        <select-manager></select-manager>
      </tree-node>

      <tree-node title="Remote signer">
      </tree-node>

      <tree-node title="About TezBridge">
        <div>
        Version: 2.0.1
        </div>
        <div>
          © 2018-2019 TezBridge
        </div>
      </tree-node>
    </nav>
  </div>
</template>

<script>
// @flow

import TreeNode from './TreeNode'
import SelectManager from './SelectManager'

export default {
  components: {
    TreeNode,
    SelectManager
  },
  data() {
    return {

    }
  }
} 
</script>

<style scoped>
.wrapper { width: 296px; }
</style>
