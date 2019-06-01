// @flow

import storage from './storage'

export let network_client = null
export let protocol = null

let ctrler = new AbortController()

export async function loadProtocolJS() {
  ctrler.abort()
  ctrler = new AbortController()

  const resp = await window.fetch(storage.settings.host + '/chains/main/blocks/head/header', {signal: ctrler.signal})
  const result = await resp.json()
  protocol = result.protocol.slice(0, 8)
  
  const js_resp = await window.fetch(`${location.origin}/protocols/${protocol}.js`, {signal: ctrler.signal})
  const js_content = await js_resp.text()
  window.eval(js_content)

  network_client = new window.TBN({
    host: storage.settings.host
  })
}

export default {
  network_client
}