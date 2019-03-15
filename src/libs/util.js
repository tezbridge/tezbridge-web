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