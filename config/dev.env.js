'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"http://skfu.spichka.dev"',
  FILE_URL: '"http://skfu.spichka.dev"',
  SOCKET_PATH: '"/api/v1/socket.io"',
})
