'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/runtime-tscn.cjs.prod.js')
} else {
  module.exports = require('./dist/runtime-tscn.cjs.js')
}
