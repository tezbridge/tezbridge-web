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

function initSetup() {

  window.errors = []
  Vue.config.errorHandler = (msg, vm, info) => {
    const wrapper = {
      error: msg.stack,
      tag: vm.$options._componentTag,
      uid: vm._uid,
      info
    }
    window.errors.unshift({
      kind: 'component',
      message: JSON.stringify(wrapper)
    })
  }
  window.onerror = (message, source, lineno, colno, error)=> {
    const wrapper = {
      error: error.stack,
      source,
      lineno,
      colno
    }
    window.errors.unshift({
      kind: 'script',
      message: JSON.stringify(wrapper)
    })
    return true
  }

}


initSetup()
new Vue({
  el: '#app',
  render: h => h(is_signer ? Signer : Index)
})

