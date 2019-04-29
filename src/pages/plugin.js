// @flow

(() => {
  const domain = location.origin
  let signer : window | null = null

  class TezBridge {
    rejects : {[number] : ( ..._ : any) => any}
    resolves : {[number] : ( ..._ : any) => any}

    constructor() {
      this.rejects = {}
      this.resolves = {}

      window.addEventListener('message', e => {
        if (e.source !== signer || !e.data.tezbridge) return false

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
      if (signer) {
        signer.focus()
        return Promise.resolve()
      }
      else {
        signer = window.open(`${domain}/signer.html`)
        return new Promise(resolve => {
          if (signer)
            signer.onload = () => {
              resolve()
            }
        })
      }
    }

    run(cmd : Object) {
      if (signer)
        signer.postMessage(cmd, domain || '*')
      else
        throw 'Signer is not opened'
    }
  }

  window.tezbridge = new TezBridge()
})()