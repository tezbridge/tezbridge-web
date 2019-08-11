// @flow

import storage from './storage'

export let network_client = null
export let protocol = null

let ctrler = new AbortController()

const default_protocol = 'Pt24m4xi'
export async function loadProtocolJS(host? : string) {
  host = host || storage.settings.host

  if (host.slice(-1) === '/')
    host = host.slice(0, -1)
  
  ctrler.abort()
  ctrler = new AbortController()

  let fallback = false
  try {
    const resp = await window.fetch(host + '/chains/main/blocks/head/header', {signal: ctrler.signal})
    const result = await resp.json()
    protocol = result.protocol.slice(0, 8)
  } catch (e) {
    protocol = default_protocol
    fallback = true
  }
  
  const eval_protocol = async () => {
    try {
      const js_resp = await window.fetch(`${location.origin}/protocols/${protocol || ''}.js`, {signal: ctrler.signal})
      const js_content = await js_resp.text()
      if (!js_content)
        throw 'fail to fetch protocol'

      window.eval(js_content)
    } catch (e) {
      protocol = default_protocol
      fallback = true
      await eval_protocol()
    }
  }
  await eval_protocol()

  network_client = new window.TBN({
    host
  })

  return !fallback
}

export default {
  network_client
}