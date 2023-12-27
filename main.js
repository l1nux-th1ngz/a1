const { app, BrowserWindow, dialog } = require('electron')
const fs = require('fs')
const path = require('path')
const shell = require('shelljs')

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('open-file-dialog', function (event) {
  dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'Shell Scripts', extensions: ['sh'] }]
  }).then(result => {
    if (!result.canceled && result.filePaths.length > 0) {
      const filePath = result.filePaths[0]
      shell.chmod('+x', filePath)
      shell.exec(filePath, { silent: true })
    }
  }).catch(err => {
    console.log(err)
  })
})
