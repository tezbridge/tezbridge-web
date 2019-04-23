<template>
  <div class="block">
    <div class="block-title">{{lang.manager.ready_manager}}:</div>
    <div>
      {{ready_manager.name 
          ? `${ready_manager.name}(${ready_manager.source})`
          : lang.manager.no_ready_manager}}
    </div>
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
      ready_manager: storage.ready_manager
    }
  }
}

</script>