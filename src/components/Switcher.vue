<template>
  <div>
    <div @click="click(v)" :class="{item: true, active: value === v}" v-for="(v, k) in data">
      {{k}}
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
  line-height: 0.8rem;
  font-size: 0.8rem;
  padding: 2px 4px;
  border: 1px solid #999;
  box-shadow: 0 2px 0 0 #ddd;
}
div.item.active {
  box-shadow: none;
  border: 1px solid #555;
  background: #eee;
  transform: translate(0, 1px);
}
</style>