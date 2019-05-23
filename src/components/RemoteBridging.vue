<template>
  <div>
    <div class="status" v-if="conn">
      <record :data="{Connected: conn.is_connected}" nomargin nocopy>
        <a href="javascript:;" class="link" @click="reset()">reset</a>
      </record>
    </div>
    <div v-if="conn && !conn.is_connected">
      <switcher class="switcher" :data="{'As bridge': 'bridge', 'As signer': 'signer'}" v-model="mode">
        <div class="step-desc">
          <span v-if="mode === 'bridge'">
            {{in_step1 ? 'Step: 1 -> Send this connection info to your remote signer' : 
            'Step: 2 -> Paste or scan your remote connection info'}}
          </span>
          <span v-if="mode === 'signer'">
            {{in_step1 ? 'Step: 1 -> Paste or scan your remote connection info' :
            'Step: 2 -> Send this connection info to your remote bridge'}}
          </span>
        </div>
        <div class="conn-wrapper">
          <div v-if="(mode === 'bridge' && in_step1) || (mode === 'signer' && !in_step1)">
            <record nomargin :data="{'Connection info': conn_info}"></record>
            <div class="op-panel">
              <img class="qrcode" :src="conn_info_qrcode">
            </div>
          </div>
          <div v-else>
            <sm-input title="Paste remote connection here" v-model="remote_info_text"></sm-input>

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
        </div>
      </switcher>

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
import Switcher from './Switcher'

export default {
  components: {
    TreeNode,
    SmInput,
    Switcher,
    Record,
    QrcodeStream,
    QrcodeDropZone,
    QrcodeCapture
  },
  data() {
    return {
      mode: 'bridge',
      conn: null,
      remote_info_text: '',
      conn_info: '',
      conn_info_qrcode: '',
      in_step1: true,
      connected_before: false
    }
  },
  watch: {
    'conn.is_connected'(connected : boolean) {
      if (this.connected_before && !connected)
        this.reset()
      else if (connected)
        this.connected_before = true
    },
    remote_info_text(info : string) {
      if (info)
        this.setRemoteInfo(info)
    }
  },
  methods: {
    async init(remote_info? : string) {
      if (signer.conn)
        signer.conn.channel.close()

      const raw_conn_info = await signer.initRemote(remote_info)
      signer.conn.onchecking = () => {
        this.in_step1 = false
      }
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
a.link {color: #555;}
a.link:visited {color: #555;}
a.link:active {color: #555;}
.switcher {margin-top: 4px;}
.step-desc {padding: 2px 4px; font-size: 0.8rem; line-height: 0.8rem; background: #289cff; color: white; }
.conn-wrapper {
  padding: 8px;
}
</style>