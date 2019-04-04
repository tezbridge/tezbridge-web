import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
Vue.use(BootstrapVue)

import Icons from '../assets/icons'
Vue.component('icon', Icons)

import Signer from '../components/Signer.vue'
new Vue({
  el: '#app',
  render: h => h(Signer)
})