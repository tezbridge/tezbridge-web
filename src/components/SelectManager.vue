<template>
  <div>
    <tree-node :title="manager.name" v-for="manager in managers">
      <manager-item @signer_set="signerSet" :is_signer="is_signer" :manager="manager"></manager-item>
    </tree-node>
  </div>
</template>

<script>
// @flow

import TreeNode from './TreeNode'
import ManagerItem from './ManagerItem'

export default {
  props: {
    is_signer: {
      type: Boolean,
      default: false
    },
    managers: {
      type: Array,
      default: () => []
    }
  },
  components: {
    TreeNode,
    ManagerItem
  },
  data() {
    return {
    }
  },
  methods: {
    signerSet(source_info : {manager: Object, source: Object}) {
      this.$emit('signer_set', source_info)
    }
  }
}
</script>

<style scoped>
  
</style>