const { app, BrowserWindow, ipcMain } = require('electron');
const googleTTS = require('google-tts-api');
const fs = require('fs');
const https = require('https');
const path = require('path');
const os = require('os');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    }
  });

  win.loadURL('http://localhost:3000/electron');
}

ipcMain.handle('request-tts', async (event, text) => {
  const url = googleTTS.getAudioUrl(text, { lang: 'ko', slow: false });
  console.log('✅ TTS URL:', url);

  const tmpFile = path.join(os.tmpdir(), `tts-${Date.now()}.mp3`);
  const file = fs.createWriteStream(tmpFile);

  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      res.pipe(file);
      file.on('finish', () => {
        file.close(() => {
          console.log('✅ 파일 다운로드 완료:', tmpFile);
          resolve(`file://${tmpFile}`);
        });
      });
    }).on('error', (err) => {
      console.error('❌ 다운로드 실패:', err);
      reject(err);
    });
  });
});

ipcMain.handle('delete-tts', async (event, filePath) => {
  const realPath = filePath.replace('file://', '');
  fs.unlink(realPath, (err) => {
    if (err) {
      console.error('❌ 파일 삭제 실패:', err);
    } else {
      console.log('✅ 파일 삭제 완료:', realPath);
    }
  });
});
