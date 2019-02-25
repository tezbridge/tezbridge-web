<template>
  <div>
    <icon icon="coffee"></icon>
    {{ lang.please_input_password }} ꜩ
    <b-button size="sm" class="bg-primary" @click="switchLang('de_DE')">{{ x }}</b-button>
  </div>
</template>

<script>
// @flow

import lang from '../langs'
import { switchLang } from '../langs'

export default {
  name: 'IndexPage',
  methods: {
    switchLang
  },
  data() {
    return {
      lang,
      x: 'test'
    }
  }  
}
</script>

<style scoped>
div {font-size: 21px;}
</style>
