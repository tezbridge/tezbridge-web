<template>
  <div>
    {{active_manager.address}}
  </div>
</template>

<script>
// @flow

import lang from '../langs'
import storage from '../libs/storage'

export default {
  data() {
    return {
      lang,
      active_manager: storage.active_manager
    }
  }
}
</script>