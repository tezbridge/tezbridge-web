import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
Vue.use(BootstrapVue)

import Icons from '../assets/icons'
Vue.component('icon', Icons)

import Index from '../components/Index.vue'
new Vue({
  el: '#app',
  render: h => h(Index)
})