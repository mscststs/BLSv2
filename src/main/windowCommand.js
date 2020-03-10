export default {
  devTool (mainWindow) {
    mainWindow.webContents.openDevTools({
      mode: 'detach'
    })
  }
}
