<template>
  <div class="wrapper">
    <div class="title">
      <span>{{title}}</span>
      <span v-if="optional && !value">({{lang.general.optional}})</span>
      <span v-if="important && value" class="important">({{lang.general.important}})</span>
      <help v-if="help" :content="help"></help>
    </div>
    <input class="selectable" :disabled="disabled" :placeholder="placeholder" :type="kind || 'text'" @paste="e => $emit('paste', e)" @input="e => $emit('input', e.target.value)" :value="value"/>
  </div>
</template>

<script>
// @flow

import Help from './Help'
import lang from '../langs'

export default {
  components: {
    Help
  },
  props: {
    placeholder: String,
    title: String,
    important: Boolean,
    value: String,
    kind: String,
    disabled: Boolean,
    optional: Boolean,
    help: String
  },
  data() {
    return {
      lang
    }
  }
}
</script>

<style scoped>
div.wrapper {width: 100%;}
div.title { font-size: 0.8rem; line-height: 0.8rem; background: #f4f4f4; text-align: center;}
span.important {color: #ff2933;}
input { font-family: Consolas, Menlo, monospace; font-size: 0.8rem; margin:0; width: 100%; border: 1px solid #eee; border-radius: 0; padding: 4px;}
input[disabled] {
  background: #eee; 
  color: #000;
  -webkit-text-fill-color: #000;
  opacity: 1;
}
::placeholder {
  color: #ccc;
}
</style>