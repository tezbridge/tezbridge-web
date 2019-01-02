// @flow

import type { TezJSON } from './../src/types'
import _assert from 'assert'
import https from 'https'
import url from 'url'

export const assert = (v: any, m : string) => {
  _assert.ok(v, m)
  console.log('\x1b[32m%s\x1b[0m','PASS @', m)
}

export const RPCFn = (raw_url: string, data?: TezJSON, method: 'POST' | 'GET') => {
  return new Promise<TezJSON>((resolve, reject) => {
    const parsed_url = url.parse(raw_url)
    const options = {
      hostname: parsed_url.hostname,
      port: parsed_url.port,
      path: parsed_url.path,
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const req = https.request(options, (res) => {
      let data = ''
      res.on('data', (d) => {
        data += d.toString()
      })

      res.on('end', () => {
        try {
          resolve(JSON.parse(data))
        } catch(err) {
          console.log('\x1b[31m%s\x1b[0m','RPC result JSON.parse error: ', data)
        }
      })
    })

    req.on('error', (e) => {
      reject(e)
    })

    if (method === 'POST') {
      req.write(JSON.stringify(data))
    }

    req.end()
  })
}