// @flow

import TBC from 'tezbridge-crypto'

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

  addListener(method: string, listener : (Object => Promise<Object>)) {
    if (!this.method_listener[method])
      this.method_listener[method] = new Set()

    this.method_listener[method].add(listener)
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
        await this.defaultMethodHandler(op)
      }
    }
  }

  async defaultMethodHandler(op : Object) {
    if (op.method === 'get_source') {
      this.send(op, this.source)
    }
  }

  send(prev_op : Object, data : Object, is_error : boolean = false) {
    window.opener.postMessage(
      Object.assign({}, is_error ? {error: data} : {result: data}, {tezbridge: prev_op.tezbridge}), window.opener.origin)
  }

  sign(op_param : Array<{}>) {

  }
}

const signer = new Signer()
export default signer