// @flow

import Vue from 'vue'
Vue.mixin({
  methods: {
    resetData() {
      Object.assign(this.$data, this.$options.data.apply(this))
    }
  }
})

import Index from '../components/Playground.vue'
new Vue({
  el: '#app',
  render: h => h(Index)
})