// @flow

import { signal } from './signals'


signal.regAction('Increment', function(s : number) {
  this.x += s
})