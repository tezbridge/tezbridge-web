// @flow

import TBC from 'tezbridge-crypto'

export default class Signer {
  box : TBC.crypto.EncryptedBox
  source : string
  op_queue : Array<{tezbridge: number, operation: string}>
  is_waiting : boolean

  constructor(box : TBC.crypto.EncryptedBox, source: string, received : (string => Promise<void>)) {
    this.is_waiting = false
    this.box = box
    this.source = source

    window.addEventListener('message', async (e) => {
      if (e.source !== window.opener || !e.data.tezbridge) return false

      if (e.data.method === 'sign') {
        this.op_queue.push(e.data)

        if (this.is_waiting) return false
        this.is_waiting = true

        let item
        while (item = this.op_queue.shift()) {
          await received.call(this, item.operation)
        }
        this.is_waiting = false
      } else if (e.data.method === 'get_source') {
        this.send(e.data, this.source)
      }
    })
  }

  send(prev_op : Object, data : Object) {
    window.opener.postMessage(
      Object.assign({}, {result: data}, {tezbridge: prev_op.tezbridge}), window.opener.origin)
  }

  sign(op : string) {

  }
}
