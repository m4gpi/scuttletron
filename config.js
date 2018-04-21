const nest = require('depnest')
const Config = require('ssb-config/inject')
const Keys = require('ssb-keys')
const Path = require('path')

const appName = process.env.APP_NAME || 'application'

const opts = {
  port: process.env.PORT || 8008
}

const config = Config(appName, opts)

exports.gives = nest('config.sync.load')

exports.create = (api) => {
  var config
  return nest('config.sync.load', () => {
    if (!config) {
      config = Config(appName, opts)
      config.keys = Keys.loadOrCreateSync(Path.join(config.path, 'secret'))
      // HACK: fix offline on windows by specifying 127.0.0.1 instead of localhost (default)
      config.remote = `net:127.0.0.1:${config.port}~shs:${config.keys.id.slice(1).replace('.ed25519', '')}`
    }
    console.log(config)
    return config
  })
}
