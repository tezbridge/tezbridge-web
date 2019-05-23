<template>
  <div>
    <div class="access-grant-wrapper" v-if="!access_granted">
      Mircophone permission is needed for 1 second to enable the Remote bridging function in Safari browser
      <div class="op-panel">
        <button @click="grantAccess">Allow</button>
      </div>
    </div>
    <div v-else>
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

              <tree-node title="Scan QRCode by camera" hard_close>
                <qrcode-stream @decode="setRemoteInfo"></qrcode-stream>
              </tree-node>
              <tree-node title="Scan QRCode by image dropping">
                <qrcode-drop-zone @decode="setRemoteInfo" @dragover="x => dropover = x">
                  <div :class="{dropzone: true, dropover}">
                    Drop remote connection QRCode here!
                  </div>
                </qrcode-drop-zone>
              </tree-node>
              <tree-node title="Scan QRCode by image uploading">
                <qrcode-capture @decode="setRemoteInfo"></qrcode-capture>
              </tree-node>
            </div>
          </div>
        </switcher>

      </div>
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

import { is_safari } from '../libs/util'
import { Connection } from '../libs/rtc'

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
      mode: is_safari ? 'signer' : 'bridge',
      conn: null,
      remote_info_text: '',
      conn_info: '',
      conn_info_qrcode: '',
      in_step1: true,
      connected_before: false,
      access_granted: is_safari ? false : true,
      dropover: false
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
    async grantAccess() {
      await Connection.grantMediaAccess('audio')
      this.access_granted = true
      this.init()
    },
    async init(remote_info? : string) {
      if (!this.access_granted)
        return false

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
      this.access_granted = true
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
.dropzone {display: flex; align-items: center; justify-content: center; font-size: 0.8rem; color: #999; border: 2px dashed #289cff; border-radius: 5px; height: 100px;}
.dropzone:hover {background: rgba(40,156,255,0.2);}
.dropover {background: rgba(40,156,255,0.2);}
a.link {color: #555;}
a.link:visited {color: #555;}
a.link:active {color: #555;}
.switcher {margin-top: 4px;}
.step-desc {padding: 2px 4px; font-size: 0.8rem; line-height: 0.8rem; background: #289cff; color: white; }
.conn-wrapper {
  padding: 8px;
}
.access-grant-wrapper { font-size: 0.8rem; line-height: 1rem }
</style>