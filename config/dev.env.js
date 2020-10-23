'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"https://skfu.spichka.dev"',
  FILE_URL: '"https://skfu.spichka.dev"',
  SOCKET_PATH: '"/api/v1/socket.io"',
})
