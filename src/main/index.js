'use strict'

import { app, BrowserWindow, Menu, ipcMain } from 'electron'
import windowCommand from './windowCommand'
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */

  Menu.setApplicationMenu(null)
  mainWindow = new BrowserWindow({
    height: 700,
    show: false,
    useContentSize: true,
    frame: false,
    backgroundColor: '#1e1e1e',
    width: 1200,
    minWidth: 850, // 最小窗口宽度
    minHeight: 600, // 最小窗口高度
    fullscreenable: false, // 禁止最大化
    webPreferences: {
      nodeIntegration: true
    }
  })

  ipcMain.on('window', (ctx, command) => {
    console.log('Window Command: ', command)
    if (windowCommand[command]) {
      // 检查是否有预定义命令函数
      windowCommand[command](mainWindow)
    } else if (mainWindow[command] && typeof mainWindow[command] === 'function') {
      // 检查是否可以直接调用
      mainWindow[command]()
    }
  })

  mainWindow.loadURL(winURL)

  mainWindow.once('ready-to-show', () => {
    mainWindow.center()
    mainWindow.show()
  })
  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
