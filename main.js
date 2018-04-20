const Path = require('path')
const url = require('url')

const {
  app,
  BrowserWindow,
  ipcMain,
} = require('electron')

const Window = require('./lib/window')
const Menu = require('./lib/menu')

var windows = {}

app.on('ready', () => {
  console.log("*** Configure Custom Electron Menu ***")
  Menu()

  console.log("*** Starting Server ***")
  ServerProcess()

  ipcMain.once('server-started', (ev, config) => {
    console.log('*** Starting App ***')
    AppProcess()
  })

  ipcMain.on('open-background-devtools', function (ev, config) {
    if (windows.background) {
      windows.background.webContents.openDevTools({ detach: true })
    }
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

const ServerProcess = () => {
  if (!windows.background) {
    windows.background = new Window(Path.join(__dirname, 'server.js'), {
      show: false,
      title: 'secrets-server',
    })
  }
}

const AppProcess = () => {
  if (!windows.main) {
    windows.main = new Window(Path.join(__dirname, 'app.js'), {
      title: "secrets-app"
    })

    windows.main.loadURL(url.format({
      pathname: Path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
    }))

    windows.main.on('closed', function () {
      window = null
    })
  }
}

