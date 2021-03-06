<template>
  <div>
    <div class="access-grant-wrapper" v-if="!access_granted">
      {{lang.remote.safari_warning}}
      <div class="op-panel">
        <button @click="grantAccess">{{lang.general.allow}}</button>
      </div>
    </div>
    <div v-else>
      <div class="status" v-if="conn">
        <record :data="{[lang.general.state]: conn.is_connected ? lang.remote.connected : lang.remote.disconnected}" nomargin nocopy>
          <a href="javascript:;" class="link" @click="reset()">{{lang.general.reset}}</a>
        </record>
      </div>

      <div v-if="conn && !conn.is_connected">
        <switcher class="switcher" :data="{[lang.remote.as_tunnel]: 'tunnel', [lang.remote.as_signer]: 'signer'}" v-model="mode">
          <div class="step-desc">
            <span v-if="mode === 'tunnel'">
              <span>
                {{in_step1 ? lang.remote.tunnel_step1 : lang.remote.tunnel_step2}}
              </span>
              <a href="javascript:;" class="next-step" v-if="in_step1" @click="in_step1 = false">{{lang.remote.go_step2}}</a>
              <a href="javascript:;" class="next-step" v-if="!in_step1" @click="in_step1 = true">{{lang.general.back}}</a>
            </span>
            <span v-if="mode === 'signer'">
              {{in_step1 ? lang.remote.signer_step1 : lang.remote.signer_step2}}
            </span>
          </div>
          <div class="conn-wrapper">
            <div v-if="(mode === 'tunnel' && in_step1) || (mode === 'signer' && !in_step1)">
              <record nomargin :data="{[lang.remote.conn_info]: conn_info}"></record>
              <div class="op-panel">
                <img class="qrcode" :src="conn_info_qrcode">
              </div>
            </div>
            <div v-else>
              <sm-input :title="lang.remote.paste_txt_image" v-model="remote_info_text" @paste="connPasted"></sm-input>

              <tree-node :title="lang.remote.qrcode_dropping">
                <div :class="{dropzone: true, dropover}" @drop.prevent="fileDrop" @dragleave="dropover = false" @dragover.prevent="x => dropover = x">
                  {{lang.remote.drop_qrcode_here}}
                </div>
              </tree-node>
              <tree-node :title="lang.remote.qrcode_loading">
                <input class="file-input" type="file" @change="e => scanFile(e.target.files[0])" capture accept="image/*" name="qrcode_file" id="qrcode_file" />
                <label class="button" for="qrcode_file">{{lang.general.load}}</label>
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
import { Connection } from '../libs/rtc'


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
      remote_info_text: '',
      conn_info: '',
      conn_info_qrcode: '',
      in_step1: true,
      connected_before: false,
      access_granted: is_apple_device ? false : true,
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

      if (signer.conn && signer.conn.channel)
        signer.conn.channel.close()

      const raw_conn_info = await signer.initRemote(remote_info)
      signer.conn.onchecking = () => {
        this.in_step1 = false
      }
      const compressed = pako.deflate(raw_conn_info, {level: 9})
      this.conn = signer.conn
      this.conn_info = TBC.codec.bs58checkEncode(compressed, new Uint8Array([]))
      this.conn_info_qrcode = await QRCode.toDataURL(
        [{data: bsQREncode(compressed), mode: 'alphanumeric'}], 
        { errorCorrectionLevel: 'L', margin: 0 })

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
      const access_granted = this.access_granted
      this.resetData()
      this.access_granted = access_granted
      this.init()
    },
    scanBitMap(img : Object) {
      const standard = 1024
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      const scale_ratio = Math.min(1, standard / img.width, standard / img.height)

      canvas.width =  img.width * scale_ratio
      canvas.height = img.height * scale_ratio

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert'
      })

      if (code) {
        const bytes = bsQRDecode(code.data)
        this.setRemoteInfo(TBC.codec.bs58checkEncode(bytes, new Uint8Array([])))
      }
    },
    scanImage(data_url : string) {
      const img = new Image()
      img.onload = () => {
        URL.revokeObjectURL(data_url)
        this.scanBitMap(img)
      }
      img.src = data_url
    },
    scanFile(blob : File) {
      this.scanImage(URL.createObjectURL(blob))
    },
    fileDrop(e : Object) {
      if (e.dataTransfer.items) {
        for (let i = 0; i < e.dataTransfer.items.length; i++) {
          const item = e.dataTransfer.items[i]
          if (item.kind === 'string' && item.type === 'text/plain') {
            item.getAsString(s => {
              if (s.indexOf('data:image') === 0)
                this.scanImage(s)
            })
          } else if (item.kind === 'file') {
            this.scanFile(item.getAsFile())
            break
          }
        }
      } else {
        this.scanFile(e.dataTransfer.files[0])
      }
    },
    connPasted(e : Object) {
      const items = (e.clipboardData || e.originalEvent.clipboardData).items
      if (!items.length)
        return false

      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        if (item.kind !== 'file')
          continue

        this.scanFile(item.getAsFile())
        break
      }
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
a.link:active {color: #555;}
.switcher {margin-top: 4px;}
.step-desc { display: flex; align-items: center; padding: 6px 8px; min-height: 32px; font-size: 0.9rem;  line-height: 0.9rem; background: #289cff; color: white; }
.step-desc .next-step { display: inline-flex; align-items: center; justify-content: center; border-radius: 4px; line-height: 1.2rem; padding: 0px 6px;background: white; color: #289cff; text-decoration: none;}
.step-desc .next-step:active {color: white;}
.conn-wrapper {
  padding: 8px;
}
.access-grant-wrapper { font-size: 0.8rem; line-height: 1rem }
.file-input {width: 0px; height: 0px; opacity: 0}
</style>