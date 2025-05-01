const { contextBridge, ipcRenderer } = require('electron');

console.log('✅ preload.js 로드됨');

contextBridge.exposeInMainWorld('electronAPI', {
  requestTTS: (text) => ipcRenderer.invoke('request-tts', text),
  deleteTTS: (fileUrl) => ipcRenderer.invoke('delete-tts', fileUrl),
});
