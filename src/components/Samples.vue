<template>
  <div>
    <import-key></import-key>

    <icon icon="coffee"></icon>
    {{ lang.please_input_password }} ꜩ
    <b-button size="sm" class="bg-primary" @click="switchLang('de_DE')">{{ x }}</b-button>

    <div>
      Received: {{ received_data }}
    </div>
    <div>
      <textarea>{{my_conn_data}}</textarea>
      <textarea v-model="other_conn_data"></textarea>
      <b-button size="sm" @click="create_conn">Create Connection</b-button>
      <b-button size="sm" @click="set_remote">Set remote info</b-button>
      <b-button size="sm" @click="use_conn">Use Connection</b-button>
    </div>
    <div>
      <textarea v-model="msg"></textarea>
      <b-button size="sm" @click="send_msg">Send</b-button>
    </div>
  </div>
</template>

<script>
// @flow

import lang from '../langs'
import { switchLang } from '../langs'

import { Connection } from '../libs/rtc'

import ImportKey from './forms/ImportKey'

export default {
  components: {
    ImportKey
  },
  methods: {
    switchLang
  },
  data() {
    return {
      lang,
      x: 'test',
      my_conn_data: '',
      other_conn_data: '',
      received_data: '',
      msg: '',
      conn: null
    }
  },
  methods: {
    send_msg() {
      this.conn.channel.send(this.msg)
    },
    create_conn() {
      const conn = new Connection()
      conn.prepared.then(() => {
        this.my_conn_data = conn.genMyInfo()
      })
      conn.connected.then(() => {
        this.received_data = 'CHANNEL OPENED'
        conn.channel.onmessage = e => {
          this.received_data = e.data
        }
      })

      this.conn = conn
    },
    set_remote() {
      this.conn.setRemoteConnInfo(this.other_conn_data)
    },
    use_conn() {
      const conn = new Connection(this.other_conn_data)

      conn.prepared.then(() => {
        this.my_conn_data = conn.genMyInfo()
      })

      conn.connected.then(() => {
        this.received_data = 'CHANNEL OPENED'
        conn.channel.onmessage = e => {
          this.received_data = e.data
        }
      })

      this.conn = conn
    }
  }
}

</script>

<style scoped>
div {font-size: 21px;}
</style>
