const extend = require('xtend')
const { app, BrowserWindow } = require('electron')

const Path = require('path')
const url = require('url')

module.exports = function (path, opts) {
  var icon = process.platform !== 'darwin'
    ? Path.join(__dirname, '..', 'assets', 'icon.png')
    : Path.join(__dirname, '..', 'assets', 'icon.icns')

  var win = new BrowserWindow(
    extend(opts, {
      icon: icon
    })
  )

  win.webContents.on('dom-ready', () => {
    win.webContents.executeJavaScript(`
      var electron = require('electron')
      electron.webFrame.setZoomLevelLimits(1, 1)
      var title = ${JSON.stringify(opts.title || 'Application')}
      var head = document.documentElement.querySelector('head')
      var element = document.createElement('title')
      element.innerHTML = title
      head.appendChild(element)
      require(${JSON.stringify(path)})
    `)
  })

  win.loadURL(url.format({
    pathname: Path.join(__dirname, '..', 'assets', 'base.html'),
    protocol: 'file:',
    slashes: true
  }))

  return win
}
