<template>
  <div class="host-wrapper">
    <div class="protocol">{{network.protocol}}</div>
    <div :class="{state: true, connected: network.connected}"></div>
    <div :class="{host: true, connected: network.connected}" @click="display_selector = !display_selector">{{settings.host}}</div>
    <loading v-if="checking_host"></loading>

    <selector :list="hosts" v-model="settings.host" class="host-selector" v-if="display_selector"></selector>
  </div>
</template>

<script>
// @flow

import Selector from './Selector'
import storage from '../libs/storage'
import { loadProtocolJS } from '../libs/network'
import * as network from '../libs/network'
import { debounce } from '../libs/util'

export default {
  components: {
    Selector
  },
  props: [],
  data() {
    return {
      display_selector: false,
      hosts: [
        'https://rpc.tzkt.io/mainnet',
        'https://mainnet.tezrpc.me',
        'https://rpc.tzbeta.net',
        'https://teznode.letzbake.com',
        'https://api.tezos.org.ua',
        'https://tezos-prod.cryptonomic-infra.tech',
        'https://rpc.tzkt.io/babylonnet',
        'https://rpctest.tzbeta.net',
        'https://tezos-dev.cryptonomic-infra.tech'
      ],
      network,
      settings: storage.settings,
      checking_host: false
    }
  },
  methods: {
  },
  watch: {
    'settings.host': debounce(async function(host){
      storage.saveSettings()
      try {
        this.checking_host = true
        await loadProtocolJS()
      } catch(e) {
      } 

      this.checking_host = false
      if (this.network.connected)
        this.display_selector = false
    }),
  },
  mounted() {
  }
}
</script>

<style scoped>
.host-wrapper > div {display: inline-block; font-size: 0.8rem;}
.state {width: 4px; height: 4px; background: rgba(255, 0, 0, 0.7) }
.state.connected { background: green; }
.protocol {margin-left: 2px;}
.host {cursor: pointer; word-break: break-all; text-decoration: line-through; color:rgba(255, 0, 0, 0.7) }
.host.connected { text-decoration: none; color: black; }

.host-selector {margin-top: 4px;}
</style>