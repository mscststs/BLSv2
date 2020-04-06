export default {
  devTool (event, mainWindow) {
    mainWindow.webContents.openDevTools({
      mode: 'detach'
    })
  }
}
