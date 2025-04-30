const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getInfo:        () => ipcRenderer.invoke('get-info'),
  onServerMsg:    (cb) => ipcRenderer.on('server-message', (e,m) => cb(m)),
  broadcast:      () => ipcRenderer.invoke('broadcast-test'),
  onUsersUpdated: (cb) => ipcRenderer.on('users-updated', (e, count) => cb(count))
});