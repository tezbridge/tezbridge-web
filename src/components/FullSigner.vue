<template>
  <div class="container" ontouchstart>
    <div v-if="!protocol_js_loaded" class="protocol-loading">
      <span>{{lang.settings.loading_protocol}}</span>
      <b>{{network.protocol}}</b>
      <loading></loading>
    </div>
    <nav class="link-tree" v-else>

      <transition name="fade">
        <tree-node v-show="step === 'ready'" :title="lang.menu.dapp_requests" :change="operations" :change1="curr_signer" bold>
          <record :data="curr_signer"></record>
          <requests :operations="operations"></requests>
          <button @click="step = 'selecting'">{{lang.general.back}}</button>
        </tree-node>
      </transition>

      <transition name="fade">
        <tree-node v-show="step === 'selecting'" :title="lang.menu.choose_signer" bold>
          <tree-node :title="lang.menu.local_managers" bold>
            <tree-node :title="lang.menu.import_key" bold>
              <import-key></import-key>
            </tree-node>
            <select-manager :managers="managers" @signer_set="localSignerInit" :is_signer="true"></select-manager>
          </tree-node>

          <tree-node :title="lang.hardware.hardware_signer" bold>
            <hardware-signer @ledger_set="ledgerInit"></hardware-signer>
          </tree-node>

          <tree-node :title="lang.menu.temp_signer" bold>
            <import-key :is_temp="true" @temp_manager_confirmed="addTempManager"></import-key>
            <select-manager :managers="temp_managers" @signer_set="localSignerInit" :is_signer="true"></select-manager>
          </tree-node>
        </tree-node>
      </transition>
      
      <tree-node v-show="step === 'selecting'" :title="lang.menu.remote_bridging" bold>
        <simple-bridging v-if="settings.bridging_mode === 'simple'"></simple-bridging>
        <remote-bridging v-else></remote-bridging>
      </tree-node>

      <tree-node :title="lang.menu.settings" bold>
        <settings></settings>
      </tree-node>
      
      <div class="copyright">
        <span>© 2018-2019</span> 
        <a href="/index.html" class="logo">TezBridge</a> 
        <ident-mark></ident-mark>
        <span>v{{version}}</span>
      </div>
    </nav>
  </div>
</template>

<script>
// @flow

declare var TBC : any

import lang from '../langs'

import signer from './Signer.js'

import TreeNode from './TreeNode'
import SelectManager from './SelectManager'
import ImportKey from './ImportKey'
import Requests from './Requests'
import Record from './Record'
import About from './About'
import HardwareSigner from './HardwareSigner'
import IdentMark from './IdentMark'

import RemoteBridging from './RemoteBridging'
import SimpleBridging from './SimpleBridging'
import Errors from './Errors'
import Settings from './Settings'

import storage from '../libs/storage'
import { loadProtocolJS } from '../libs/network'
import * as network from '../libs/network'

import { version } from '../../package.json'

export default {
  components: {
    TreeNode,
    SelectManager,
    Errors,
    ImportKey,
    HardwareSigner,
    RemoteBridging,
    SimpleBridging,
    Requests,
    Record,
    Settings,
    About,
    IdentMark
  },
  data() {
    return {
      lang,
      version,
      errors: window.errors,
      protocol_js_loaded: false,
      network,
      managers: storage.managers,
      settings: storage.settings,
      temp_managers: [],
      curr_signer: {
        [lang.signer.manager]: undefined,
        [lang.signer.source]: undefined
      },
      operations: [],
      step: 'selecting'    // selecting || ready
    }
  },
  methods: {
    async addTempManager(key : Object) {
      const box = new TBC.crypto.EncryptedBox(key.getSecretKey())
      const enc = await box.show()

      this.temp_managers.push({
        name: key.address,
        enc
      })
    },
    async localSignerInit({manager, source} : {manager: Object, source: string}) {
      signer.initLocal(manager, source)
      const key = await manager.revealKey()
      this.curr_signer = {
        [lang.signer.manager]: key.address,
        [lang.signer.source]: source
      } 
      this.step = 'ready'
    },
    async ledgerInit(
        {source, pub_key, manager, sign} : 
        {source: string, pub_key: string, manager: string, sign: string => Promise<string>}) {

      signer.initLedger(source, pub_key, sign)
      this.curr_signer = {
        [lang.signer.manager]: manager,
        [lang.signer.source]: source
      }
      this.step = 'ready'
    }
  },
  async mounted() {
    await loadProtocolJS()
    this.protocol_js_loaded = true

    signer.addListener(signer.ask_methods, op => 
      new Promise((resolve, reject) => {
        this.operations.push({
          state: {
            op_hash: '',
            step: 0
          },
          op,
          resolve,
          reject
        })
      })
    )
  }
} 
</script>

<style scoped>
.container {margin-right: 4px;}
.copyright {margin: 8px 0 0 0px; font-size: 0.8rem; color: #ccc;}
.copyright * {vertical-align: baseline;}
.logo {font-family: 'Dancing Script'; font-weight: 700; text-decoration: none; font-size: 1rem; color: #777;}
a.link { margin: 4px 0; display: block; color: #555;}
a.link:visited {color: #555;}
a.link:active {color: #555;}

.link-tree {position: relative;}

.fade-enter {
  transform: translate(16px, 0);
  opacity: 0;
}
.fade-leave-to {
  transform: translate(16px, 0);
  opacity: 0;
}
.fade-leave, .fade-leave-active {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
