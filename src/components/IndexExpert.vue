<template>
  <div class="wrapper" ontouchstart>
    <nav class="link-tree">
      <tree-node title="Create key">
        <create-key></create-key>
      </tree-node>

      <tree-node title="Import key" :limited="1">
        <import-key></import-key>
      </tree-node>

      <tree-node title="Select manager">
        <select-manager></select-manager>
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
import ImportKey from './ImportKey'
import SelectManager from './SelectManager'

export default {
  components: {
    TreeNode,
    CreateKey,
    ImportKey,
    SelectManager
  },
  data() {
    return {

    }
  }
}
</script>

<style scoped>
</style>