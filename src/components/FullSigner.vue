<template>
  <div class="container" ontouchstart>
    <nav class="link-tree">
      <tree-node title="Requests" :change="operations" :change1="curr_signer" bold>
        <record :data="curr_signer"></record>
        <requests :operations="operations"></requests>
      </tree-node>

      <tree-node title="Local signer" bold>
        <select-manager :managers="managers" @signer_set="localSignerInit" :is_signer="true"></select-manager>
      </tree-node>

      <tree-node title="Remote signer" bold @first_open="remoteSignerInit">
        <record :data="{Connection: conn_info}"></record>
        <textarea v-model="remote_conn_info"></textarea>
      </tree-node>

      <tree-node title="Temp signer" bold>
        <import-key :is_temp="true" @temp_manager_confirmed="addTempManager"></import-key>
        <select-manager :managers="temp_managers" @signer_set="localSignerInit" :is_signer="true"></select-manager>
      </tree-node>

      <tree-node title="About" bold>
        <about></about>
      </tree-node>

      <div class="copyright">
        © 2018-2019 TezBridge
      </div>
    </nav>
  </div>
</template>

<script>
// @flow

import zlib from 'zlib'

import lang from '../langs'

import signer from './Signer.js'
import TBC from 'tezbridge-crypto'

import TreeNode from './TreeNode'
import SelectManager from './SelectManager'
import ImportKey from './ImportKey'
import Requests from './Requests'
import Record from './Record'
import About from './About'

import storage from '../libs/storage'

export default {
  components: {
    TreeNode,
    SelectManager,
    ImportKey,
    Requests,
    Record,
    About
  },
  data() {
    return {
      lang,
      managers: storage.managers,
      temp_managers: [],
      curr_signer: {
        [lang.signer.manager]: undefined,
        [lang.signer.source]: undefined
      },
      conn_info: '',
      remote_conn_info: '',
      operations: []
    }
  },
  watch: {
    async remote_conn_info(x : string) {
      if (x.indexOf('answer') > -1)
        await signer.setRemote(x)
      else
        this.conn_info = await signer.initRemote(x)
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
    },
    async remoteSignerInit() {
      const raw_conn_info = await signer.initRemote()
      zlib.deflate(raw_conn_info, {level: 9}, (err, result) => {
        this.conn_info = TBC.codec.bs58checkEncode(result, new Uint8Array([]))
      })
    }
  },
  mounted() {
    signer.addListener(signer.ask_methods, op => 
      new Promise((resolve, reject) => {
        this.operations.push({
          processing: false,
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
.copyright {margin: 8px 0 0 -1px; font-size: 0.8rem; color: #ccc;}
</style>
