/* eslint-env browser */
/* global __SERVER__ */

import 'babel-polyfill'

import { UnavailableStackException } from './exceptions'

// the option credentials:include tells fetch to include the cookies in the
// request even for cross-origin requests
const fetchOptions = {
  credentials: 'include'
}

let COZY_URL = __SERVER__

module.exports = {
  init ({cozyURL}) {
    COZY_URL = cozyURL
  },
  get: {
    async apps () {
      try {
        const response = await fetch(`//${COZY_URL}/apps/`, fetchOptions)
        const data = await response.json()
        return data.data
      } catch (e) {
        throw new UnavailableStackException()
      }
    },
    async diskUsage () {
      try {
        const response = await fetch(`//${COZY_URL}/settings/disk-usage`, fetchOptions)
        const data = await response.json()
        return data.data
      } catch (e) {
        throw new UnavailableStackException()
      }
    }
  }
}
