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

import Loading from '../components/Loading'
Vue.component('loading', Loading)


import Index from '../components/IndexExpert.vue'
import Signer from '../components/FullSigner.vue'

const is_signer = location.search.indexOf('?signer') === 0

if (is_signer)
  document.title = 'TezBridge Signer'

new Vue({
  el: '#app',
  render: h => h(is_signer ? Signer : Index)
})
