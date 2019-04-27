<template>
  <div :class="{wrapper: true}">
    <div class="title" @click="titleClick">
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
    title: String
  },
  data() {
    return {
      first_open: true,
      is_open: false
    }
  },
  methods: {
    titleClick() {
      if (!this.is_open && this.first_open) {
        this.first_open = false
        this.$emit('first_open')
      }
      
      this.is_open = !this.is_open
    }
  }
}
</script>

<style scoped>
span.mark {display: inline-flex; width: 16px; height: 16px; align-items: center; justify-content: center; }
div.content {margin-left: 16px;}
div.title {padding: 4px 0; text-overflow: ellipsis; white-space: nowrap; overflow: hidden}
div.title:active {background: #eee}
</style>