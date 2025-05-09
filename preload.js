const { contextBridge, ipcRenderer } = require('electron');

console.log('✅ preload.js 로드됨');

contextBridge.exposeInMainWorld('electronAPI', {
  requestTTS: (text) => ipcRenderer.invoke('request-tts', text),
  deleteTTS: (fileUrl) => ipcRenderer.invoke('delete-tts', fileUrl),

  // ✅ FFmpeg 송출 제어 추가
  listAudioDevices: () => ipcRenderer.invoke('list-audio-devices'),
  startStream: (streamKey) => ipcRenderer.invoke('start-stream', streamKey),
  stopStream: () => ipcRenderer.invoke('stop-stream'),
});
