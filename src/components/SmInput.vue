<template>
  <div class="wrapper">
    <div class="title">
      <span>{{title}}</span>
      <span v-if="optional && !value">(optional)</span>
      <span v-if="important && value" class="important">({{important}})</span>
    </div>
    <input class="selectable" :disabled="disabled" :type="kind || 'text'" @input="e => $emit('input', e.target.value)" :value="value"/>
  </div>
</template>

<script>
// @flow

export default {
  props: {
    title: String,
    important: String,
    value: String,
    kind: String,
    disabled: Boolean,
    optional: Boolean
  },
  data() {
    return {
    }
  }
}
</script>

<style scoped>
div.title { font-size: 0.8rem; background: #f4f4f4; text-align: center;}
span.important {color: red;}
input { font-family: Consolas, Menlo, monospace; font-size: 1rem; margin:0; width: 100%; border: 1px solid #eee; border-radius: 0; padding: 4px;}
input[disabled] {
  background: #eee; 
  color: #000;
  -webkit-text-fill-color: #000;
  opacity: 1;
}

</style>