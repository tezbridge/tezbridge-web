<template>
  <div>
    <div class="wrapper" v-if="item !== undefined" v-for="(item, key) in (data || {})">
      <div class="title">
        <span> {{key}} </span>
        <span v-if="item instanceof Array" class="important">(must remember)</span>
        <icon icon="copy" size="sm" class="copy-btn" @click="copyContent(key)"></icon>
      </div>
      <div class="content selectable" :data-key="key">
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
  },
  methods: {
    copyContent(key : string) {
      const elem = this.$el.querySelector(`[data-key="${key}"]`)
      const range = document.createRange()
      const selection = window.getSelection()
      range.selectNodeContents(elem)
      selection.removeAllRanges()
      selection.addRange(range)
      document.execCommand("copy")
    }
  }
}
</script>

<style scoped>
div.wrapper { margin-top: 8px }
span.important {color: #ff2933;}
div.content { 
  font-family: TZ, Consolas, Menlo, monospace; 
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

.copy-btn {
  cursor: pointer;
  transition: all 0.05s; 
}
.copy-btn:active {
  color: black;
}
</style>