<template>
  <div>
    <div class="status" v-if="conn">
      <button @click="reset()">Reset</button>
      Connected: {{conn.is_connected}}
    </div>
    <div v-if="conn && !conn.is_connected">
      <tree-node title="As bridge">
        <div v-if="in_step1">
          <record :data="{Connection: conn_info}"></record>
          <img class="qrcode" :src="conn_info_qrcode">
          <div class="element">
            <button @click="in_step1 = false">Connection info is set in signer</button>
          </div>
        </div>
        <div v-else>
          <sm-input class="element" title="Paste remote connection here" v-model="remote_info_text"></sm-input>

          <tree-node title="Scan QRCode by camera">
            <qrcode-stream @decode="setRemoteInfo"></qrcode-stream>
          </tree-node>
          <tree-node title="Scan QRCode by image dropping">
            <qrcode-drop-zone class="dropzone" @decode="setRemoteInfo"></qrcode-drop-zone>
          </tree-node>
          <tree-node title="Scan QRCode by image uploading">
            <qrcode-capture @decode="setRemoteInfo"></qrcode-capture>
          </tree-node>
          
        </div>
      </tree-node>
      <tree-node title="As signer">
        <div v-if="in_step1">
          <sm-input class="element" title="Paste remote connection here" v-model="remote_info_text"></sm-input>

          <tree-node title="Scan QRCode by camera">
            <qrcode-stream @decode="setRemoteInfo"></qrcode-stream>
          </tree-node>
          <tree-node title="Scan QRCode by image dropping">
            <qrcode-drop-zone class="dropzone" @decode="setRemoteInfo"></qrcode-drop-zone>
          </tree-node>
          <tree-node title="Scan QRCode by image uploading">
            <qrcode-capture @decode="setRemoteInfo"></qrcode-capture>
          </tree-node>
        </div>
        <div v-else>
          <record :data="{Connection: conn_info}"></record>
          <img class="qrcode" :src="conn_info_qrcode">
        </div>
      </tree-node>

  <!--     <tree-node title="Using text">
        <record :data="{Connection: conn_info}"></record>
        <sm-input class="element" title="Paste remote connection here" v-model="remote_info_text"></sm-input>
      </tree-node>    
      <tree-node title="Using QRCode">
        <img class="qrcode" :src="conn_info_qrcode">
        <tree-node title="Scan remote's by camera">
          <qrcode-stream @decode="setRemoteInfo"></qrcode-stream>
        </tree-node>
        <tree-node title="Scan remote's by image drop">
          <qrcode-drop-zone class="dropzone" @decode="setRemoteInfo"></qrcode-drop-zone>
        </tree-node>
        <tree-node title="Scan remote's by image upload">
          <qrcode-capture @decode="setRemoteInfo"></qrcode-capture>
        </tree-node>
      </tree-node> -->
    </div>
  </div>
</template>

<script>
// @flow

import pako from 'pako'
import TBC from 'tezbridge-crypto'
import QRCode from 'qrcode'
import { QrcodeStream, QrcodeDropZone, QrcodeCapture } from 'vue-qrcode-reader'

import signer from './Signer.js'

import TreeNode from './TreeNode'
import Record from './Record'
import SmInput from './SmInput'

export default {
  components: {
    TreeNode,
    SmInput,
    Record,
    QrcodeStream,
    QrcodeDropZone,
    QrcodeCapture
  },
  data() {
    return {
      conn: null,
      remote_info_text: '',
      conn_info: '',
      conn_info_qrcode: '',
      in_step1: true
    }
  },
  watch: {
    'conn.is_connected'(v : boolean) {

    },
    remote_info_text(info : string) {
      this.setRemoteInfo(info)
    }
  },
  methods: {
    async init(remote_info? : string) {
      if (signer.conn)
        signer.conn.channel.close()
      
      const raw_conn_info = await signer.initRemote(remote_info)
      const compressed = pako.deflate(raw_conn_info, {level: 9})
      this.conn = signer.conn
      this.conn_info = TBC.codec.bs58checkEncode(compressed, new Uint8Array([]))
      this.conn_info_qrcode = await QRCode.toDataURL(this.conn_info, { errorCorrectionLevel: 'low'})

      if (remote_info)
        this.in_step1 = false
    },
    async setRemoteInfo(info : string) {
      const raw = TBC.codec.bs58checkDecode(info, new Uint8Array([]))
      const remote_conn_info = pako.inflate(raw, { to: 'string' })
      if (remote_conn_info.indexOf('answer') > -1)
        await signer.setRemote(remote_conn_info)
      else
        this.init(remote_conn_info)
    },
    reset() {
      this.resetData()
      this.init()
    }
  },
  mounted() {
    this.init()
  }
}
</script>

<style scoped>
.qrcode {max-width: 100%;}
.dropzone {border: 2px dashed #289cff; border-radius: 5px; width: 100px; height: 100px;}
</style>