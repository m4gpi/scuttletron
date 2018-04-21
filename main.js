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
  new Menu
  new ServerProcess

  ipcMain.once('server-started', AppProcess)
  ipcMain.on('open-background-devtools', openDevTools)
})

function ServerProcess () {
  if (!windows.background) {
    windows.background = new Window(Path.join(__dirname, 'server.js'), {
      show: false,
      title: 'Server',
    })
  }
}

function AppProcess () {
  if (!windows.main) {
    windows.main = new Window(Path.join(__dirname, 'app.js'), {
      title: 'App'
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

function openDevTools () {
  if (windows.background) {
    windows.background.webContents.openDevTools({ detach: true })
  }
}
