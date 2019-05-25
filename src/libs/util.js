// @flow

export function debounce(fn : (..._: any) => any) {
  let t = setTimeout(() => {}, 0)
  return function() {
    const [self, args] = [this, arguments]
    clearTimeout(t)
    t = setTimeout(() => {
      fn.apply(self, args)
    }, 200)
  }
}

export function r2tz(input : number) {
  return '' + Math.round(input * 1000000)
}

export function tz2r(input : string) {
  return parseInt(input) / 1000000 + ''
}

export const is_safari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/)

export async function list_camera() {
  if (navigator.mediaDevices){
    const devices = await navigator.mediaDevices.enumerateDevices()
    return devices.filter(x => x.kind === 'videoinput')
  } else
    throw 'no camera'
}