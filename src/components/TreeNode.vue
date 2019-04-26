<template>
  <div :class="{wrapper: true, limited1: limited === 1, limited2: limited === 2}">
    <div class="title" @click="is_open = !is_open">
      <span class="mark">{{is_open ? '-' : '+'}}</span><span>{{title}}</span>
    </div>
    <div class="content" v-show="is_open">
      <slot></slot>
    </div>
  </div>
</template>

<script>
// @flow

export default {
  props: {
    title: String,
    limited: Number
  },
  data() {
    return {
      is_open: false
    }
  }
}
</script>

<style scoped>
div.limited1 { width: 296px; }
div.limited2 { width: 280px; }
span.mark {display: inline-flex; width: 16px; height: 16px; align-items: center; justify-content: center; }
div.content {margin-left: 16px;}
div.title {padding: 4px 0;}
div.title:active {background: #eee}
</style>