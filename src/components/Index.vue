<template>
  <div>
    {{ lang.please_input_password }} ꜩ
    <b-button class="bg-primary text-secondary" @click="switchLang('zh_cn')">{{ x }}</b-button>
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