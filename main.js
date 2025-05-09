const { app, BrowserWindow, ipcMain } = require('electron');
const googleTTS = require('google-tts-api');
const fs = require('fs');
const https = require('https');
const path = require('path');
const os = require('os');
const { spawn } = require('child_process');

let ffmpegProcess = null;
let cachedAudioDevice = null;

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      webSecurity: false,
    },
  });

  win.loadURL('http://localhost:3000/electron');
}

// 오디오 장치 자동 감지
async function detectFirstAudioDevice(ffmpegPath) {
  return new Promise((resolve, reject) => {
    const listProc = spawn(ffmpegPath, ['-list_devices', 'true', '-f', 'dshow', '-i', 'dummy']);

    let stderr = '';
    listProc.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    listProc.on('close', () => {
      const lines = stderr.split('\n');
      const audioLines = lines.filter((line) => line.includes('(audio)'));
      if (audioLines.length > 0) {
        const match = audioLines[0].match(/"(.*?)"/);
        if (match) {
          console.log('✅ 감지된 오디오 장치:', match[1]);
          resolve(match[1]);
          return;
        }
      }
      reject(new Error('No audio devices found.'));
    });
  });
}

async function getCachedAudioDevice(ffmpegPath) {
  if (cachedAudioDevice) return cachedAudioDevice;
  cachedAudioDevice = await detectFirstAudioDevice(ffmpegPath);
  return cachedAudioDevice;
}

// FFmpeg 송출 시작
ipcMain.handle('start-stream', async (event, streamKey) => {
  if (ffmpegProcess) {
    console.log('⚠️ FFmpeg already running.');
    return { status: 'already-running' };
  }

  const ffmpegPath = path.join(__dirname, 'electron', 'resources', 'ffmpeg', 'ffmpeg.exe');
  const rtmpUrl = `rtmp://stream.azitbase.com/stream/${streamKey}`;

  let audioDeviceName;
  try {
    audioDeviceName = await getCachedAudioDevice(ffmpegPath);
  } catch (err) {
    console.error('❌ 오디오 감지 실패:', err);
    return { status: 'error', message: 'No audio devices found' };
  }

  const args = [
    '-f', 'gdigrab', '-framerate', '30',
    '-offset_x', '0', '-offset_y', '0', '-video_size', '1920x1080',
    '-i', 'desktop',
    '-f', 'dshow', '-i', `audio=${audioDeviceName}`,
    '-c:v', 'libx264', '-c:a', 'aac', '-preset', 'veryfast',
    '-f', 'flv', rtmpUrl,
];


  ffmpegProcess = spawn(ffmpegPath, args);

  ffmpegProcess.stdout.on('data', (data) => console.log(`FFmpeg stdout: ${data}`));
  ffmpegProcess.stderr.on('data', (data) => console.error(`FFmpeg stderr: ${data}`));
  ffmpegProcess.on('close', (code) => {
    console.log(`FFmpeg process exited with code ${code}`);
    ffmpegProcess = null;
  });

  return { status: 'started' };
});

// FFmpeg 송출 중지
ipcMain.handle('stop-stream', async () => {
  if (ffmpegProcess) {
    ffmpegProcess.kill();
    ffmpegProcess = null;
    console.log('✅ FFmpeg process killed.');
    return { status: 'stopped' };
  }
  return { status: 'not-running' };
});

// 오디오 장치 리스트 반환
ipcMain.handle('list-audio-devices', async () => {
  const ffmpegPath = path.join(__dirname, 'electron', 'resources', 'ffmpeg', 'ffmpeg.exe');
  try {
    const device = await detectFirstAudioDevice(ffmpegPath);
    return { success: true, device };
  } catch (err) {
    console.error('❌ 오디오 장치 감지 실패:', err);
    return { success: false, error: err.message };
  }
});

// TTS 요청
ipcMain.handle('request-tts', async (event, text) => {
  const url = googleTTS.getAudioUrl(text, { lang: 'ko', slow: false });
  const tmpFile = path.join(os.tmpdir(), `tts-${Date.now()}.mp3`);
  const file = fs.createWriteStream(tmpFile);

  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        console.error(`❌ TTS 다운로드 실패: HTTP ${res.statusCode}`);
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }

      res.pipe(file);
      file.on('finish', () => file.close(() => resolve(`file://${tmpFile}`)));
    }).on('error', reject);
  });
});

// TTS 파일 삭제
ipcMain.handle('delete-tts', async (event, fileUrl) => {
  const filePath = fileUrl.replace('file://', '');
  fs.unlink(filePath, (err) => {
    if (err) console.error('❌ 파일 삭제 실패:', err);
    else console.log('✅ 파일 삭제 완료:', filePath);
  });
});

app.whenReady().then(createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
