// @flow

import TBC from 'tezbridge-crypto'
import { network_client } from '../libs/network'

class Signer {
  box : TBC.crypto.EncryptedBox
  source : string
  op_queue : Array<{method: string, tezbridge: string, param: Object}>
  is_waiting : boolean
  method_listener : {[string]: Set<(Object => Promise<Object>)>}

  constructor() {
    this.is_waiting = false
    this.method_listener = {}
    this.op_queue = []

    window.addEventListener('message', async (e) => {
      if (e.source !== window.opener || !e.data.tezbridge) return false

      this.op_queue.push(e.data)

      this.response()
    })
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

  init(box : TBC.crypto.EncryptedBox, source: string) {
    this.box = box
    this.source = source

    this.response()
  }

  async response() {
    if (!this.source) return false

    let op
    while (op = this.op_queue.shift()) {
      const method = op.method

      if (this.method_listener[method]) {
        try {
          const listeners = Array.from(this.method_listener[method])
          for (let i = 0; i < listeners.length; i++) {
            const listener = listeners[i]
            const result = await listener(op)
            if (result !== undefined)
              this.send(op, result)
          }
        } catch (e) {
          await this.send(op, e, true)
          continue
        }
      } else {
        throw `Invalid method: ${method} for signer`
      }
    }
  }

  send(prev_op : Object, data : Object, is_error : boolean = false) {
    window.opener.postMessage(
      Object.assign({}, is_error ? {error: data} : {result: data}, {tezbridge: prev_op.tezbridge}), window.opener.origin)
  }

  async autoSign(op_params : Object) {
    const sk = await this.box.reveal()
    return await network_client.mixed.makeMinFeeOperation(TBC, this.source, sk, op_params)
  }

  async inject(sign_result : Object) {
    return await network_client.submit.inject_operation(sign_result.operation_with_sig)
  }

  async methodHandler(op : Object, resolve : Object => void) {
    if (op.method === 'auto_sign_inject') {
      const result = await signer.autoSign(op.operation)
      const inject_result = await signer.inject(result)
      resolve({
        operation_id: inject_result,
        originated_contracts: result.originated_contracts
      })
    } else if (op.method === 'sign') {
      const sk = await this.box.reveal()
      resolve(TBC.crypto.signOperation(op.bytes, sk))
    } else if (op.method === 'inject') {
      const inject_result = await signer.inject(op.bytes)
      resolve(inject_result)
    }
  }
}

const signer = new Signer()

signer.addListener('get_source', () => new Promise((resolve, reject) => {
  resolve(signer.source)
}))


export default signer