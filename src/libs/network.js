// @flow

import storage from './storage'

export let network_client = null
export let protocol = null

let ctrler = new AbortController()

export async function loadProtocolJS(host? : string) {
  host = host || storage.settings.host

  if (host.slice(-1) === '/')
    host = host.slice(0, -1)
  
  ctrler.abort()
  ctrler = new AbortController()

  let result = true
  try {
    const resp = await window.fetch(host + '/chains/main/blocks/head/header', {signal: ctrler.signal})
    const result = await resp.json()
    protocol = result.protocol.slice(0, 8)
  } catch {
    protocol = 'Pt24m4xi'
    result = false
  }
  
  const js_resp = await window.fetch(`${location.origin}/protocols/${protocol}.js`, {signal: ctrler.signal})
  const js_content = await js_resp.text()
  window.eval(js_content)

  network_client = new window.TBN({
    host
  })

  return result
}

export default {
  network_client
}