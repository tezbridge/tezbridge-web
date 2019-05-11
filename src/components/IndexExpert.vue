<template>
  <div class="wrapper" ontouchstart>
    <nav class="link-tree">
      <tree-node title="Create key">
        <create-key></create-key>
      </tree-node>

      <tree-node title="Import key">
        <import-key></import-key>
      </tree-node>

      <tree-node title="Select manager">
        <select-manager></select-manager>
      </tree-node>

      <tree-node title="Settings">
        <settings></settings>
      </tree-node>
      
      <tree-node title="About TezBridge">
        <about></about>
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
import Settings from './Settings'
import About from './About'

export default {
  components: {
    TreeNode,
    CreateKey,
    ImportKey,
    SelectManager,
    Settings,
    About
  },
  data() {
    return {

    }
  }
}
</script>

<style scoped>
.wrapper { width: 304px; }
</style>