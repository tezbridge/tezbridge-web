<template>
  <div>
    <div class="wrapper" v-if="item !== undefined" v-for="(item, key) in (data || {})">
      <div class="title">
        <span> {{key}} </span>
        <span v-if="item instanceof Array" class="important">(important)</span>
        <icon icon="copy" size="sm" class="copy-btn" @click="copyContent(key)"></icon>
        <span :data-copied="key">copied</span>
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
      copied: false
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

      const copied_desc = this.$el.querySelector(`[data-copied="${key}"]`)
      copied_desc.className = 'copied'
      setTimeout(() => {
        copied_desc.className = ''
      }, 500)
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

[data-copied] {
  display: inline-block;
  transform: translate(16px, 0);
  opacity: 0;
}
.copied {
  opacity: 1;
  transform: translate(0, 0);
}
</style>