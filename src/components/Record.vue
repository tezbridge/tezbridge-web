<template>
  <div>
    <div class="wrapper" v-if="item" v-for="(item, key) in data">
      <div class="title">
        <span>{{key}}</span>
        <span v-if="item instanceof Array" class="important">(must remember)</span>
      </div>
      <div class="content selectable">
        {{item instanceof Array ? item[0] : item}}
      </div>
    </div>
  </div>
</template>

<script>
// @flow

export default {
  props: ['data'],
  data() {
    return {
    }
  }
}
</script>

<style scoped>
div.wrapper { margin-top: 8px }
div.title { font-size: 0.8rem; background: #f0f0f0; text-align: center;}
span.important {color: #ff2933;}
div.content { 
  font-family: Consolas, Menlo, monospace; 
  font-size: 1rem; 
  padding: 4px;
  color: #289cff;
  border: 0;
  border-bottom: 1px solid #f8f8f8;
  word-break: break-word;
}
div.title {
  background: #f8f8f8;
  text-align: left;
  padding-left: 4px;
  color: #999;
}
</style>