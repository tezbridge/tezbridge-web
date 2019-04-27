<template>
  <div>
    <div v-if="!key">
      <sm-input :title="lang.password" v-model="password"></sm-input>
    </div>
    <div v-else>
      <tree-node :title="key.address">
      </tree-node>
      <tree-node title="contracts">
      </tree-node>
    </div>
  </div>
</template>

<script>
// @flow

import TreeNode from './TreeNode'
import storage from '../libs/storage'
import SmInput from './SmInput'

import lang from '../langs'

export default {
  components: {
    SmInput,
    TreeNode
  },
  props: ['manager'],
  data() {
    return {
      lang,
      password: '',
      key: null
    }
  }
}
</script>

<style scoped>
  
</style>