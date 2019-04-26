<template>
  <div class="wrapper" ontouchstart>
    <nav class="link-tree">
      <tree-node title="Create key">
        <create-key></create-key>
      </tree-node>

      <tree-node title="Import key">
      </tree-node>

      <tree-node title="Select manager">
      </tree-node>

      <tree-node title="Settings">
      </tree-node>
      
      <tree-node title="About">
        © 2018-2019 TezBridge
      </tree-node>
    </nav>
  </div>
</template>

<script>
// @flow

import TreeNode from './TreeNode'
import CreateKey from './CreateKey'

export default {
  components: {
    TreeNode,
    CreateKey
  },
  data() {
    return {

    }
  }
}
</script>

<style scoped>
</style>