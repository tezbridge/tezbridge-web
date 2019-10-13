// @flow

import basex from 'base-x'

const BASE10 = `0123456789`
const BASE45 = `0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:`
const BASE58 = `123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz`

export function bs58Encode(input : Uint8Array) {
  const bs = basex(BASE58)
  return bs.encode(Buffer.from(input))
}

export function bsQREncode(input : Uint8Array) {
  const bs = basex(BASE45)
  return bs.encode(Buffer.from(input))
}
export function bsQRDecode(input : string) {
  const bs = basex(BASE45)
  return bs.decode(input)
}

export function debounce(fn : (..._: any) => any) {
  let t
  return function() {
    const [self, args] = [this, arguments]
    clearTimeout(t)
    t = setTimeout(() => {
      fn.apply(self, args)
    }, 300)
  }
}

export function r2tz(input : number) {
  return '' + Math.round(input * 1000000)
}

export function tz2r(input : string) {
  return parseInt(input) / 1000000 + ''
}

export const is_apple_device = !!navigator.userAgent.match(/iPhone|iPad|Mac\ OS/)
export const is_mobile = !!navigator.userAgent.match(/Mobile/)

export async function list_camera() {
  if (navigator.mediaDevices){
    const devices : Object = await navigator.mediaDevices.enumerateDevices()
    return devices.filter(x => x.kind === 'videoinput')
  } else
    throw 'no camera'
}