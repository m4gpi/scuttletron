const Config = require('ssb-config/inject')
const Keys = require('ssb-keys')
const Path = require('path')

module.exports = function () {
  var config

  return configure()

  function configure () {
    if (!config) {
      const appName = process.env.APP_NAME || 'App'
      const port = process.env.PORT || 8808

      const opts = {
        port: port
      }

      config = Config(appName, opts)
      config.keys = Keys.loadOrCreateSync(Path.join(config.path, 'secret'))
      config.remote = `net:127.0.0.1:${config.port}~shs:${config.keys.id.slice(1).replace('.ed25519', '')}`
    }
    return config
  }
}
