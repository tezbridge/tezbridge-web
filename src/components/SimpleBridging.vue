<template>
  <div>
    <div class="access-grant-wrapper" v-if="!access_granted">
      {{lang.remote.safari_warning}}
      <div class="op-panel">
        <button @click="grantAccess">{{lang.general.allow}}</button>
      </div>
    </div>
    <div v-else>
      <div class="status">
        <record :data="{[lang.general.state]: conn && conn.is_connected ? lang.remote.connected : lang.remote.disconnected}" nomargin nocopy>
          <a href="javascript:;" class="link" @click="reset()">{{lang.general.reset}}</a>
        </record>
      </div>

      <div v-if="!conn || !conn.is_connected">
        <switcher class="switcher" :data="{[lang.remote.as_tunnel]: 'tunnel', [lang.remote.as_signer]: 'signer'}" v-model="mode">
          <div class="step-desc">
          </div>
          <div class="conn-wrapper">
            <div v-if="mode === 'tunnel'">
              <div class="conn-code">Code: {{conn_code}}</div>
              <sm-input title="input connection code from remote" v-model="remote_conn_code"></sm-input>
            </div>
            <div v-else>
              <sm-input title="input connection code from remote" v-model="remote_conn_code"></sm-input>
              <div class="conn-code" v-if="remote_conn_code">Code: {{conn_code}}</div>
            </div>
          </div>
        </switcher>

      </div>
    </div>

  </div>
</template>

<script>
// @flow

declare var TBC : any

import lang from '../langs'

import pako from 'pako'
import QRCode from 'qrcode'
import jsQR from 'jsqr'

import signer from './Signer.js'

import TreeNode from './TreeNode'
import Record from './Record'
import SmInput from './SmInput'
import Switcher from './Switcher'

import { is_apple_device, is_mobile, bsQREncode, bsQRDecode } from '../libs/util'
import { Connection, fetchInfo, postInfo } from '../libs/rtc'


export default {
  components: {
    TreeNode,
    SmInput,
    Switcher,
    Record
  },
  data() {
    return {
      lang,
      mode: is_mobile ? 'signer' : 'tunnel',
      conn: null,
      remote_conn_code: '',
      conn_code: '',
      connected_before: false,
      access_granted: is_apple_device ? false : true,
    }
  },
  watch: {
    'conn.is_connected'(connected : boolean) {
      if (this.connected_before && !connected)
        this.reset()
      else if (connected)
        this.connected_before = true
    },
    async remote_conn_code(code : string) {
      if (code.length === 5) {
        const remote_info = await fetchInfo(code)
        this.setRemoteInfo(remote_info)
      }
    }
  },
  methods: {
    async grantAccess() {
      await Connection.grantMediaAccess('audio')
      this.access_granted = true
      this.init()
    },
    reset() {
      const access_granted = this.access_granted
      this.resetData()
      this.access_granted = access_granted
      this.init()
    },
    async setRemoteInfo(info : string) {
      const raw = TBC.codec.bs58checkDecode(info, new Uint8Array([]))
      const remote_conn_info = pako.inflate(raw, { to: 'string' })
      if (remote_conn_info.indexOf('answer') > -1)
        await signer.setRemote(remote_conn_info)
      else
        this.init(remote_conn_info)
    },
    async init(remote_info? : string) {
      const raw_info = await signer.initRemote(remote_info)
      const compressed = pako.deflate(raw_info, {level: 9})
      const bs58info = TBC.codec.bs58checkEncode(compressed, new Uint8Array([]))
      this.conn_code = await postInfo(bs58info)
      this.conn = signer.conn
    }
  },
  mounted() {
    this.init()
  }
}
</script>

<style scoped>
a.link {color: #555;}
a.link:active {color: #555;}
.switcher {margin-top: 4px;}
.step-desc { display: flex; align-items: center;  min-height: 1px; font-size: 0.9rem;  line-height: 0.9rem; background: #289cff; color: white; }
.conn-wrapper {
  padding: 8px;
}
.access-grant-wrapper { font-size: 0.8rem; line-height: 1rem }
.file-input {width: 0px; height: 0px; opacity: 0}
.conn-code { font-family: Consolas, Menlo, monospace; text-align: center;}
</style>