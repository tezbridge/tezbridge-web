<template>
  <div>
    <tree-node :title="manager.name" v-for="manager in managers">
      <manager-item @source_set="sourceSet" :is_signer="is_signer" :manager="manager"></manager-item>
    </tree-node>
  </div>
</template>

<script>
// @flow

import TreeNode from './TreeNode'
import storage from '../libs/storage'
import ManagerItem from './ManagerItem'

export default {
  props: {
    is_signer: {
      type: Boolean,
      default: false
    }
  },
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
  },
  methods: {
    sourceSet(source_info : {manager: Object, source: Object}) {
      this.$emit('source_set', source_info)
    }
  }
}
</script>

<style scoped>
  
</style>