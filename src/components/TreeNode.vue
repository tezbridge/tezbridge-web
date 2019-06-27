<template>
  <div :class="{wrapper: true}">
    <div :class="{title: true, bold}" @click="titleClick">
      <icon icon="angle-right" size="sm" :class="{mark: true, changed: !!changed, rotated: is_open || keep_opening}"></icon>
      <span>{{title}}</span>
    </div>
    <div class="content" v-show="is_open || keep_opening" v-if="!hard_close || (hard_close && is_open)">
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
    },
    hard_close: {
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
.mark {
  margin-left: 2px;
  opacity: 0.2;
  vertical-align: middle;
}
div.content {margin-left: 12px;}
div.title { padding: 4px 0; text-overflow: ellipsis; white-space: nowrap; overflow: hidden}
div.title:active {background: #eee}
div.bold {font-weight: 700}
.changed {animation: change-ani 1s infinite}

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

.rotated {
  transform: rotate(90deg);
  opacity: 1;
}
</style>