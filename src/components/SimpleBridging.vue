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
        <div class="conn-setup-title" v-if="!mode">
          {{lang.remote.choose_my_role}}
        </div>
        <div class="conn-setup-wrapper" v-if="!mode">
          <div class="diagram-block">
            <icon icon="code" size="sm"></icon>
            <span>{{lang.general.app}}</span>
          </div>
          <icon icon="arrows-alt-h"></icon>
          <button @click="mode = 'tunnel'">
            <icon icon="wifi" size="sm"></icon>
            <span>{{lang.remote.tunnel}}</span>
          </button>
          <icon icon="arrows-alt-h"></icon>
          <button @click="mode = 'signer'">
            <icon icon="mobile-alt"  size="sm"></icon>
            <span>{{lang.tools.signer}}</span>
          </button>
        </div>
        <div class="conn-wrapper">
          <div v-if="mode === 'tunnel'">
            <div class="conn-code">
              <span>{{lang.remote.code}}: {{conn_code}}</span>
              <loading v-if="loading"></loading>
            </div>
            <sm-input :title="lang.remote.input_conn_code_signer" v-model="remote_conn_code"></sm-input>
            <div v-if="fetch_error" class="error">{{lang.remote.invalid_code}}</div>
          </div>

          <div v-if="mode === 'signer'">
            <sm-input :title="lang.remote.input_conn_code_tunnel" v-model="remote_conn_code"></sm-input>
            <div v-if="fetch_error" class="error">{{lang.remote.invalid_code}}</div>
            <div class="conn-code" v-if="conn || loading">
              <span>{{lang.remote.code}}: {{conn_code}}</span>
              <loading v-if="loading"></loading>
            </div>
          </div>
        </div>
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
      mode: '',
      loading: false,
      conn: null,
      remote_conn_code: '',
      conn_code: '',
      fetch_error: false,
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
        this.loading = true
        const remote_info = await fetchInfo(code.replace(/#/g, ''))
        if (!remote_info)
          this.fetch_error = true
        else
          this.fetch_error = false

        this.loading = false
        await this.setRemoteInfo(remote_info)
      }
    },
    mode(mode : string) {
      if (mode === 'tunnel') 
        this.init()
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
      
      this.loading = true

      const conn_code = await postInfo(bs58info)
      this.conn_code = conn_code.padEnd(5, '#')
      this.conn = signer.conn

      this.loading = false
    }
  },
  mounted() {
  }
}
</script>

<style scoped>
a.link {color: #555;}
a.link:active {color: #555;}
.switcher {margin-top: 4px;}
.step-desc { display: flex; align-items: center;  min-height: 1px; font-size: 0.9rem;  line-height: 0.9rem; background: #289cff; color: white; }
.conn-wrapper {
  margin: 8px 0 ;
  text-align: center;
}
.access-grant-wrapper { font-size: 0.8rem; line-height: 1rem }
.file-input {width: 0px; height: 0px; opacity: 0}
.conn-code { text-align: center; margin: 4px 0 ;}
.conn-code span { font-family: Consolas, Menlo, monospace;  } 

.diagram-block {
  font-size: 0.9rem;
  padding: 3px 6px;
  border: 0;
  border-radius: 2px;
  background: #fff;
  border: 1px solid #eee;
  display: inline-flex;
  align-items: center;
}
.diagram-block svg {
  margin-right: 4px;
}
.conn-setup-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}
.conn-setup-wrapper > * {
  margin: 0 3px;
}
.conn-setup-title {
  text-align: center;
  margin: 4px 0;
}
button {
  padding: 3px 6px;
}
button svg {
  margin-right: 4px;
}
</style>