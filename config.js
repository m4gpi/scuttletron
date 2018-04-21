const Config = require('ssb-config/inject')
const Keys = require('ssb-keys')
const Path = require('path')

module.exports = function () {
  var config

  return configure()

  function configure () {
    if (!config) {
      const appName = process.env.APP_NAME || 'application'

      const opts = {
        port: process.env.PORT || 8008
      }

      config = Config(appName, opts)
      config.keys = Keys.loadOrCreateSync(Path.join(config.path, 'secret'))
      // HACK: fix offline on windows by specifying 127.0.0.1 instead of localhost (default)
      config.remote = `net:127.0.0.1:${config.port}~shs:${config.keys.id.slice(1).replace('.ed25519', '')}`
    }
    return config
  }
}
