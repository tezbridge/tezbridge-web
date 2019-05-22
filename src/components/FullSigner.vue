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
        <div v-if="conn">
          IsConnected: {{conn.is_connected}}
        </div>
        <record :data="{Connection: conn_info}"></record>
        <img class="qrcode" :src="conn_info_img">

        <switcher :data="{Camera: 'stream', FileDrop: 'dropzone', FileSelect: 'capture'}" v-model="qrcode_scan_mode"></switcher>
        <qrcode-stream v-if="qrcode_scan_mode === 'stream'" @decode="readQRCode"></qrcode-stream>
        <qrcode-drop-zone v-if="qrcode_scan_mode === 'dropzone'" class="dropzone" @decode="readQRCode"></qrcode-drop-zone>
        <qrcode-capture v-if="qrcode_scan_mode === 'capture'" @decode="readQRCode"></qrcode-capture>
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

import pako from 'pako'
import QRCode from 'qrcode'
import { QrcodeStream, QrcodeDropZone, QrcodeCapture } from 'vue-qrcode-reader'

import lang from '../langs'

import signer from './Signer.js'
import TBC from 'tezbridge-crypto'

import TreeNode from './TreeNode'
import SelectManager from './SelectManager'
import ImportKey from './ImportKey'
import Requests from './Requests'
import Record from './Record'
import About from './About'
import Switcher from './Switcher'

import storage from '../libs/storage'

export default {
  components: {
    TreeNode,
    QrcodeStream,
    QrcodeDropZone,
    QrcodeCapture,
    SelectManager,
    Switcher,
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
      conn: null,
      conn_info: '',
      conn_info_img: '',
      qrcode_scan_mode: '',
      remote_conn_info: '',
      operations: []
    }
  },
  watch: {
    async remote_conn_info(result : string) {
      await this.readQRCode(result)
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
    async remoteSignerInit(remote_info? : string) {
      const raw_conn_info = await signer.initRemote(remote_info)
      const compressed = pako.deflate(raw_conn_info, {level: 9})
      this.conn = signer.conn
      this.conn_info = TBC.codec.bs58checkEncode(compressed, new Uint8Array([]))
      this.conn_info_img = await QRCode.toDataURL(this.conn_info, { errorCorrectionLevel: 'low'})
    },
    async readQRCode(result : string) {
      const raw = TBC.codec.bs58checkDecode(result, new Uint8Array([]))
      const remote_conn_info = pako.inflate(raw, { to: 'string' })
      if (remote_conn_info.indexOf('answer') > -1)
        await signer.setRemote(remote_conn_info)
      else
        this.remoteSignerInit(remote_conn_info)
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
.qrcode {max-width: 100%;}
.dropzone {border: 2px dashed #289cff; border-radius: 5px; width: 100px; height: 100px;}
</style>
