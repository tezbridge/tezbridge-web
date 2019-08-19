// @flow

(() => {
  const host = 'https://www.tezbridge.com'
  // const host = 'https://dev-vm:1234'

  const arg_templates = {
    KT1_to_tz(address : string, amount : string) {
      return [{"prim":"NIL","args":[{"prim":"operation"}]},{"prim":"PUSH","args":[{"prim":"key_hash"},{"string":address}]},{"prim":"IMPLICIT_ACCOUNT"},{"prim":"PUSH","args":[{"prim":"mutez"},{"int":amount + ''}]},{"prim":"UNIT"},{"prim":"TRANSFER_TOKENS"},{"prim":"CONS"},{"prim":"DIP","args":[[{"prim":"DROP"}]]}]
    },
    KT1_to_KT1(address : string, amount : string) {
      return [{"prim":"NIL","args":[{"prim":"operation"}]},{"prim":"PUSH","args":[{"prim":"contract","args":[{"prim":"or","args":[{"prim":"lambda","args":[{"prim":"unit"},{"prim":"list","args":[{"prim":"operation"}]}],"annots":["%do"]},{"prim":"unit","annots":["%default"]}]}]},{"string":address}]},{"prim":"PUSH","args":[{"prim":"mutez"},{"int":amount+''}]},{"prim":"UNIT"},{"prim":"RIGHT","args":[{"prim":"lambda","args":[{"prim":"unit"},{"prim":"list","args":[{"prim":"operation"}]}]}]},{"prim":"TRANSFER_TOKENS"},{"prim":"CONS"},{"prim":"DIP","args":[[{"prim":"DROP"}]]}]
    }
  }

  class TezBridge {
    signer : window
    rejects : {[number] : ( ..._ : any) => any}
    resolves : {[number] : ( ..._ : any) => any}
    txid: number
    templates : Object

    mode : string
    constructor() {
      this.rejects = {}
      this.resolves = {}
      this.txid = 0
      this.mode = 'local'
      this.templates = arg_templates

      window.addEventListener('message', e => {
        if (e.source !== this.signer ||
            !e.data.tezbridge) return false

        if (e.data.mode) {
          this.mode = e.data.mode
        } else if (e.data.error) {
          this.rejects[e.data.tezbridge](e.data.error)
        } else {
          this.resolves[e.data.tezbridge](e.data.result)
        }

        delete this.rejects[e.data.tezbridge]
        delete this.resolves[e.data.tezbridge] 
      })
    }

    ready() {
      if (this.signer && !this.signer.closed) {
        return Promise.resolve()
      }
      else {
        this.signer = window.open(`${host}/index.html?signer`)
        return new Promise(resolve => {
          const fn = (e) => {
            if (e.source !== this.signer) return false
            window.removeEventListener('message', fn)
            resolve()
          }
          window.addEventListener('message', fn)
        })
      }
    }

    async request(param : Object) {
      await this.ready()
      
      if (this.signer) {
        this.txid++

        if (param.method !== 'get_source' && this.mode === 'local')
          this.signer.focus()

        return new Promise<void>((resolve, reject) => {
          this.resolves[this.txid] = resolve  
          this.rejects[this.txid] = reject

          this.signer.postMessage(Object.assign({}, param, {
            tezbridge: this.txid
          }), host)
        })
      }
      else
        throw 'Signer is not opened'
    }
  }

  window.tezbridge = new TezBridge()
})()