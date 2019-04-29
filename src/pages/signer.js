// @flow

import Vue from 'vue'
Vue.mixin({
  methods: {
    resetData() {
      Object.assign(this.$data, this.$options.data.apply(this))
    }
  }
})

import Icons from '../assets/icons'
Vue.component('icon', Icons)

import Signer from '../components/Signer.vue'
new Vue({
  el: '#app',
  render: h => h(Signer)
})