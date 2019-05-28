<template>
  <div>
    <div @click="click(v)" :class="{item: true, active: value === v}" v-for="(v, k) in data">
      {{k}}
    </div>
    <div class="content-wrapper" v-if="$slots.default">
      <slot></slot>
    </div>
  </div>
</template>

<script>
// @flow

export default {
  props: {
    data: {
      type: Object,
      default: {}
    },
    value: String
  },
  data() {
    return {
    }
  },
  methods: {
    click(item : string) {
      this.$emit('input', item)
    }
  }
}
</script>

<style scoped>
div.item {
  display: inline-flex;
  line-height: 1rem;
  font-size: 1rem;
  padding: 4px 8px;
  color: #999
}
div.item.active {
  background: #289cff;
  color: white;
}
.content-wrapper {
  border: 1px solid #289cff;
  border-top: none;
}
</style>