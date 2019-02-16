// @flow

import React from 'react'

export class App extends React.Component<any> {
  constructor(props : {signal : any, content : any}) {
    super()
    props.signal.root = this
  }

  render() {
    return this.props.content()
  }
}

export class Models {
  models : {[string]: Models | Object}

  constructor() {
    this.models = {}
  }

  update(name : string, value : Models | Object) {
    if (value instanceof Models)
      throw `Cannot update sub models`

    this.models[name] = value
  }

  add(name : string, value : Models | Object) {
    if (this.models[name])
      throw `The models already contrain ${name}`

    this.models[name] = value
  }

  get(name : string, ...names : Array<string>) {
    if (!names.length) {
      return this.models[name]
    } else {
      const result = {[name]: this.models[name]}
      names.forEach(name => {
        result[name] = this.models[name]
      })
      return result
    }
  }
}

const t = {}
export class Signal {
  signals : typeof t
  actions : {[string]: Set<(..._ : Array<any>) => any>}
  root : React.Component<any> | null

  constructor() {
    this.signals = {}
    this.actions = {}
    this.root = null
  }

  regAction(name : string, fn : (..._ : Array<any>) => any) {
    if (!this.signals[name])
      throw `No such signal as: ${name}`

    if (!this.actions[name]) {
      const self = this
      this.signals[name] = function() {
        const args = arguments
        return model => {
          self.actions[name].forEach(fn => {
            fn.apply(model, arguments)
          })
          self.forceUpdate()
        }
      }

      this.actions[name] = new Set()
    }

    this.actions[name].add(fn)
  }

  forceUpdate() {
    this.root && this.root.forceUpdate()
  }
}

