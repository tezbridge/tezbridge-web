<template>
  <div :class="{wrapper: true}">
    <div class="title" @click="titleClick">
      <span :class="{mark: true, changed: !!changed}">{{is_open || keep_opening ? '-' : '+'}}</span>
      <span>{{title}}</span>
    </div>
    <div class="content" v-show="is_open || keep_opening">
      <slot></slot>
    </div>
  </div>
</template>

<script>
// @flow

export default {
  props: {
    title: String,
    keep_opening: {
      type: Boolean,
      default: false
    },
    change: [Object, Array]
  },
  data() {
    return {
      changed: false,
      first_open: true,
      is_open: false
    }
  },
  watch: {
    change() {
      if (!this.is_open)
        this.changed = true
    }
  },
  methods: {
    titleClick() {
      this.changed = false

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
span.mark {display: inline-flex; border: 1px solid transparent; border-radius: 2px; width: 16px; height: 16px; align-items: center; justify-content: center; }
div.content {margin-left: 16px;}
div.title {padding: 4px 0; text-overflow: ellipsis; white-space: nowrap; overflow: hidden}
div.title:active {background: #eee}
span.changed {border: 1px solid #777; animation: change-ani 2s infinite}

@keyframes change-ani {
  0% {
    box-shadow: 0 0 0 0 #777;
  }

  50% {
    box-shadow: 1px 1px 0 0 #777;
  }

  100% {
    box-shadow: 0 0 0 0 #777;
  }
}
</style>