// @flow

declare var TBC : any

import { network_client, loadProtocolJS } from '../libs/network'
import { Connection } from '../libs/rtc'


class Signer {
  box : TBC.crypto.EncryptedBox
  source : string
  op_queue : Array<{method: string, tezbridge: string, param: Object}>
  ask_methods : Array<string>
  is_waiting : boolean
  method_listener : {[string]: Set<(Object => Promise<Object>)>}

  caller_origin : string
  conn : Connection

  constructor() {
    this.is_waiting = false
    this.method_listener = {}
    this.op_queue = []
    this.ask_methods = [
      'raw_sign', 'raw_inject', 'inject_operations',
      'create_account', 'set_delegate', 'set_host'
    ]

    window.addEventListener('message', async (e) => {
      if (e.source !== window.opener || !e.data.tezbridge) return false

      this.caller_origin = e.origin

      if (this.conn && this.conn.is_connected) {
        this.conn.channel.send(JSON.stringify(e.data))
      } else {
        this.op_queue.push(e.data)
        this.response() 
      }
    })

    if (window.opener) {
      window.opener.postMessage('ready', '*')
    }
  }

  addListener(methods: string | Array<string>, listener : (Object => Promise<Object>)) {
    if (typeof methods === 'string')
      methods = [methods]

    methods.forEach(method => {
      if (!this.method_listener[method])
        this.method_listener[method] = new Set()

      this.method_listener[method].add(listener)
    })
  }
  removeListener(method: string, listener : (Object => Promise<Object>)) {
    this.method_listener[method].delete(listener)
  }

  initLocal(box : TBC.crypto.EncryptedBox, source: string) {
    this.box = box
    this.source = source

    this.response()
  }

  async initRemote(remote_info? : string) {
    if (this.caller_origin) {
      window.opener.postMessage({mode: 'local', tezbridge: -1}, this.caller_origin)
    }

    this.conn = new Connection(remote_info)
    this.conn.onmessage = e => {
      const input = JSON.parse(e.data)
      if (this.caller_origin) {
        window.opener.postMessage(input, this.caller_origin)
      } else {
        this.op_queue.push(input)
        this.response()
      }
    }
  
    await this.conn.prepared

    ;(async () => {
      await this.conn.connected

      if (this.caller_origin) {
        window.opener.postMessage({mode: 'remote', tezbridge: -1}, this.caller_origin)
        const ops = this.op_queue
        this.op_queue = []
        ops.forEach(op => {
          this.conn.channel.send(JSON.stringify(op))
        })
      }
    })()

    return this.conn.genMyInfo()
  }

  async setRemote(remote_info : string) {
    this.conn.setRemoteConnInfo(remote_info)
  }

  async response() {
    if (!this.source) return false

    const ops = this.op_queue
    this.op_queue = []
    ops.forEach(async op => {
      const method = op.method

      if (this.method_listener[method]) {
        try {
          const listeners = Array.from(this.method_listener[method])
          for (let i = 0; i < listeners.length; i++) {
            const listener = listeners[i]
            const result = await listener(op)
            if (result !== undefined)
              this.send(op.tezbridge, result)
          }
        } catch (e) {
          this.send(op.tezbridge, e, true)
        }
      } else {
        throw `Invalid method: ${method} for signer`
      }
    })
  }

  send(id : string, data : Object, is_error : boolean = false) {
    if (data instanceof Error)
      window.errors.unshift({
        kind: 'signer',
        message: data.stack
      })

    const reply_msg = Object.assign({}, is_error ? {error: data.toString()} : {result: data}, {tezbridge: id})
    if (this.conn && this.conn.is_connected)
      this.conn.channel.send(JSON.stringify(reply_msg))
    else
      window.opener.postMessage(reply_msg, this.caller_origin)
  }

  async autoSign(op_params : Object) {
    const sk = await this.box.reveal()
    if (network_client)
      return await network_client.mixed.makeMinFeeOperation(TBC, this.source, sk, op_params)
    else
      throw `Network client hasn't been set to specific protocol`
  }

  async inject(sign_result : Object) {
    if (network_client)
      return await network_client.submit.inject_operation(sign_result.operation_with_sig)
    else
      throw `Network client hasn't been set to specific protocol`
  }

  async methodHandler(op : Object, resolve : Object => void) {
    const method = op.method
    delete op.method
    delete op.tezbridge
    
    const handler_mapping = {
      async create_account() {
        const result = await this.autoSign([Object.assign({}, op, {
          kind: 'origination'
        })])
        const inject_result = await this.inject(result)
        resolve({
          operation_id: inject_result,
          originated_contracts: result.originated_contracts
        })
        return inject_result
      },
      async set_delegate() {
        const result = await this.autoSign([Object.assign({}, op, {
          kind: 'delegation'
        })])
        const inject_result = await this.inject(result)
        resolve({
          operation_id: inject_result
        })
        return inject_result
      },
      async inject_operations()  {
        const result = await this.autoSign(op.operations)
        const inject_result = await this.inject(result)
        resolve({
          operation_id: inject_result,
          originated_contracts: result.originated_contracts
        })
        return inject_result
      },
      async raw_sign() {
        const sk = await this.box.reveal()
        const result = TBC.crypto.signOperation(op.bytes, sk)
        resolve(result)
        return result
      },
      async raw_inject() {
        const inject_result = await signer.inject(op.bytes)
        resolve(inject_result)
        return inject_result
      },
      async set_host() {
        await loadProtocolJS(op.host)
        resolve(true)
      }
    }

    if (!handler_mapping[method])
      throw `Invalid method: ${method}`

    return await handler_mapping[method].call(this)
  }
}

const signer = new Signer()

signer.addListener('get_source', () => new Promise((resolve, reject) => {
  resolve(signer.source)
}))


export default signer