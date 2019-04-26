<template>
  <div :class="{wrapper: true, limited}">
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
    limited: Boolean
  },
  data() {
    return {
      is_open: false
    }
  }
}
</script>

<style scoped>
div.limited { width: 280px; }
span.mark {display: inline-flex; width: 16px; height: 16px; align-items: center; justify-content: center; }
div.content {margin-left: 16px;}
div.title {padding: 4px 0;}
div.title:active {background: #eee}
</style>