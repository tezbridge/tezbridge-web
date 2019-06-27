// @flow

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon as Icons } from '@fortawesome/vue-fontawesome'

import { faSync } from '@fortawesome/free-solid-svg-icons/faSync'
import { faCopy } from '@fortawesome/free-solid-svg-icons/faCopy'
import { faMobileAlt } from '@fortawesome/free-solid-svg-icons/faMobileAlt'
import { faWifi } from '@fortawesome/free-solid-svg-icons/faWifi'
import { faCode } from '@fortawesome/free-solid-svg-icons/faCode'
import { faArrowsAltH } from '@fortawesome/free-solid-svg-icons/faArrowsAltH'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons/faAngleRight'

library.add(
  faSync,
  faCopy,
  faMobileAlt,
  faCode,
  faWifi,
  faArrowsAltH,
  faAngleRight
)

export default Icons