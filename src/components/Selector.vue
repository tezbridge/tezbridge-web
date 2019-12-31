<template>
  <div class="wrapper">
    <input class="selectable" :placeholder="placeholder" type="text" @input="e => $emit('input', e.target.value)" :value="value"/>
    <div class="list">
      <div @click="$emit('input', item)" class="item" :key="item" v-for="item in list">
        {{item}}
      </div>
    </div>
  </div>
</template>

<script>
// @flow

export default {
  components: {
  },
  props: {
    placeholder: String,
    value: String,
    list: Array
  },
  data() {
    return {
    }
  },
  methods: {
  }
}
</script>

<style scoped>
div.wrapper {width: 100%;}
input { font-family: Consolas, Menlo, monospace; font-size: 0.8rem; margin:0; width: 100%; border: 1px solid #eee; border-radius: 0; padding: 4px;}
::placeholder {
  color: #ccc;
}
.item { padding: 4px; cursor: pointer; font-size: 0.8rem; border: 1px solid #f8f8f8; border-top: 0 }
.item:nth-child(odd) { background: #f8f8f8}
.item:hover {color: white; background: #999}
</style>