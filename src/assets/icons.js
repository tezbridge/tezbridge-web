// @flow

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon as Icons } from '@fortawesome/vue-fontawesome'

import { faSync } from '@fortawesome/free-solid-svg-icons/faSync'
import { faCopy } from '@fortawesome/free-solid-svg-icons/faCopy'

library.add(
  faSync,
  faCopy
)

export default Icons