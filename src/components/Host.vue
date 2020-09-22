<template>
  <div class="host-wrapper">
    <div :class="{protocol: true, fail2load: !!network.fail2load}">{{network.fail2load || network.protocol}}</div>
    <div class="splitter"></div>
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
        'https://mainnet-tezos.giganode.io',
        'https://testnet-tezos.giganode.io',
        'https://rpc.tzbeta.net',
        'https://rpctest.tzbeta.net',
        'https://teznode.letzbake.com',
        'https://tezos-prod.cryptonomic-infra.tech',
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
.splitter {width: 4px; height: 4px; background: #000 }
.protocol {margin-left: 2px; text-decoration: none; color: black; }
.protocol.fail2load {text-decoration: line-through;  color:rgba(255, 0, 0, 0.7)}
.host {cursor: pointer; word-break: break-all; text-decoration: line-through; color:rgba(255, 0, 0, 0.7) }
.host.connected { text-decoration: none; color: black; }

.host-selector {margin-top: 4px;}
</style>