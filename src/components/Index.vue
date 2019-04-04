<template>
  <div>
    <ready-manager></ready-manager>
    <select-manager></select-manager>
    <!-- <samples></samples> -->
  </div>
</template>

<script>
// @flow

import ReadyManager from './ReadyManager'
import SelectManager from './forms/SelectManager'

import Samples from './Samples'

export default {
  components: {
    ReadyManager,
    SelectManager,
    Samples
  },
  data() {
    return {

    }
  }
}
</script>
