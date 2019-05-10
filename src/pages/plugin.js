// @flow

(() => {
  const domain = location.origin

  class TezBridge {
    signer : window
    rejects : {[number] : ( ..._ : any) => any}
    resolves : {[number] : ( ..._ : any) => any}
    txid: number

    constructor() {
      this.rejects = {}
      this.resolves = {}
      this.txid = 0

      window.addEventListener('message', e => {
        if (e.source !== this.signer ||
            !e.data.tezbridge) return false

        if (e.data.error) {
          this.rejects[e.data.tezbridge](e.data.error)
        } else {
          this.resolves[e.data.tezbridge](e.data.result)
        }

        delete this.rejects[e.data.tezbridge]
        delete this.resolves[e.data.tezbridge] 
      })
    }

    ready() {
      if (this.signer) {
        return Promise.resolve()
      }
      else {
        this.signer = window.open(`${domain}/#signer`)
        return new Promise(resolve => {
          if (this.signer)
            this.signer.onload = () => {
              resolve()
            }
        })
      }
    }

    request(param : Object) {
      if (this.signer) {
        this.txid++

        if (new Set(['auto_sign_inject', 'sign', 'inject']).has(param.method))
          this.signer.focus()

        return new Promise<void>((resolve, reject) => {
          this.resolves[this.txid] = resolve  
          this.rejects[this.txid] = reject

          this.signer.postMessage(Object.assign({}, param, {
            tezbridge: this.txid
          }), domain || '*')
        })
      }
      else
        throw 'Signer is not opened'
    }
  }

  window.tezbridge = new TezBridge()
})()