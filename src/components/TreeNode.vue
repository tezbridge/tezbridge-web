<template>
  <div :class="{wrapper: true}">
    <div :class="{title: true, bold}" @click="titleClick">
      <span :class="{mark: true, changed: !!changed}">{{is_open || keep_opening ? '-' : '+'}}</span><span>{{title}}</span>
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
    change: [Object, Array],
    change1: [Object, Array],
    bold: {
      type: Boolean,
      default: false
    }
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
    },
    change1() {
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
span.mark {
  display: inline-flex; 
  border-radius: 2px; 
  align-items: center; 
  justify-content: center; 
  margin-right: 4px;
  width: 8px;
  font-size: 0.9rem;
  line-height: 1.2rem;
}
div.content {margin-left: 12px;}
div.title {padding: 4px 0; text-overflow: ellipsis; white-space: nowrap; overflow: hidden}
div.title:active {background: #eee}
div.bold {font-weight: 700}
span.changed {animation: change-ani 1s infinite}

@keyframes change-ani {
  0% {
    opacity: 1
  }

  50% {
    opacity: 0
  }

  100% {
    opacity: 1
  }
}
</style>