<template>
  <div>
    <div>
      {{lang.general.version}}: {{ version }}
    </div>
  </div>
</template>

<script>
// @flow

import lang from '../langs'

import { version } from '../../package.json'

export default {
  data() {
    return {
      version,
      lang
    }
  }
}
</script>

<style scoped>
  
</style>