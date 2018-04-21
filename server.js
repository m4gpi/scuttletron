const Server = require('scuttlebot')
const fs = require('fs')
const Path = require('path')
const electron = require('electron')

Server.use(require('scuttlebot/plugins/master'))
      .use(require('scuttlebot/plugins/gossip'))
      .use(require('scuttlebot/plugins/replicate'))

var config = require('./config').create().config.sync.load()

const server = new Server(config)

const manifest = server.getManifest()

fs.writeFileSync(Path.join(config.path, 'manifest.json'), JSON.stringify(manifest))
electron.ipcRenderer.send('server-started')
