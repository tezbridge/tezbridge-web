<template>
  <div>
    <div v-for="err in errors" class="err-item">
      <record :data="err"></record>
    </div>
  </div>
</template>

<script>
// @flow

import Record from './Record'

export default {
  components: {
    Record
  },
  data() {
    return {
      errors: window.errors
    }
  }
}
</script>

<style scoped>
.err-item { border-bottom: 1px solid black }
</style>