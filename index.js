const electron = require('electron')
const { app, BrowserWindow } = electron
const path = require('path')

app.on('ready', () => {
  const win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
    },
  })
  const filepath = `file://${path.join(app.getAppPath(), 'build/index.html')}`
  win.loadURL(filepath)
})
