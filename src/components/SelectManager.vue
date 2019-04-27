<template>
  <div>
    <tree-node :title="manager.name" v-for="manager in managers">
      <manager-item :manager="manager"></manager-item>
    </tree-node>
  </div>
</template>

<script>
// @flow

import TreeNode from './TreeNode'
import storage from '../libs/storage'
import ManagerItem from './ManagerItem'

export default {
  components: {
    TreeNode,
    ManagerItem
  },
  data() {
    return {
      managers: []
    }
  },
  mounted() {
    this.managers = storage.managers
  }
}
</script>

<style scoped>
  
</style>