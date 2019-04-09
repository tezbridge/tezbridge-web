<template>
  <div>
    <ready-manager></ready-manager>
    <select-manager @selected="([box, name]) => selected_manager = {box, name}"></select-manager>
    <manager :box="selected_manager.box" :name="selected_manager.name"></manager>
  </div>
</template>

<script>
// @flow

import ReadyManager from './ReadyManager'
import SelectManager from './forms/SelectManager'
import Manager from './Manager'

export default {
  components: {
    Manager,
    ReadyManager,
    SelectManager
  },
  data() {
    return {
      selected_manager: {
        box: null,
        name: ''
      }
    }
  }
}
</script>
