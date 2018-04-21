const Path = require('path')
const url = require('url')

const {
  app,
  BrowserWindow,
  ipcMain,
} = require('electron')

const Window = require('./lib/window')
const Menu = require('./lib/menu')

const appName = process.env.APP_NAME || "App"

var windows = {}

app.on('ready', () => {
  Menu()
  ServerProcess()

  ipcMain.once('server-started', AppProcess)
  ipcMain.on('open-background-devtools', openDevTools)
})

const ServerProcess = () => {
  if (!windows.background) {
    windows.background = Window(Path.join(__dirname, 'server.js'), {
      show: false,
      title: 'Server',
    })
  }
}

const AppProcess = () => {
  if (!windows.main) {
    windows.main = Window(Path.join(__dirname, 'app/index.js'), {
      title: appName
    })

    windows.main.loadURL(url.format({
      pathname: Path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
    }))

    windows.main.on('closed', () => {
      windows.main = null
      windows.background = null
      if (process.platform !== 'darwin') app.quit()
    })
  }
}

const openDevTools = () => {
  if (windows.background) {
    windows.background.webContents.openDevTools({ detach: true })
  }
}
