const electron = require('electron')
const extend = require('xtend')
const { app, BrowserWindow } = electron

const Path = require('path')
const url = require('url')

module.exports = function createWindow (path, opts) {
  var win = new electron.BrowserWindow(opts)

  win.webContents.on('load-url', () => {
    console.log("*** Opening Window ***")
    win.webContents.executeJavaScript(`
      var electron = require('electron')
      electron.webFrame.setZoomLevelLimits(1, 1)
      var title = ${JSON.stringify(opts.title || 'Secrets')}
      var head = document.documentElement.querySelector('head')
      var element = document.createElement('title')
      element.innerHTML = title
      head.appendChild(element)
      require(${JSON.stringify(path)})
    `)
  })

  win.loadURL(url.format({
    pathname: Path.join(__dirname, '..', 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  return win
}
