// @flow

import { Signal } from '../framework'

export const signal = new Signal()
signal.signals = {}


signal.signals.Increment = (value : number) => (_ : any) => {}



export const signals = signal.signals
