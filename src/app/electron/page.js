'use client';

import { useState, useRef, useEffect } from 'react';

export default function ElectronPage() {
  const [audioUrl, setAudioUrl] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [audioDevice, setAudioDevice] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    const fetchAudioDevices = async () => {
      try {
        const result = await window.electronAPI.listAudioDevices();
        if (result.success) {
          console.log('✅ 감지된 오디오 장치:', result.device);
          setAudioDevice(result.device);
        } else {
          console.error('❌ 오디오 장치 감지 실패:', result.error);
        }
      } catch (err) {
        console.error('❌ 오디오 장치 가져오기 실패:', err);
      }
    };
    fetchAudioDevices();
  }, []);

  const handleClick = async () => {
    const url = await window.electronAPI.requestTTS("안녕하세요 Test 입니다. 하찮은 휴먼");
    console.log('✅ URL 받음:', url);
    setAudioUrl(url);

    if (audioRef.current) {
      audioRef.current.src = url;
      audioRef.current.play().catch(err => console.error('❌ play error:', err));
    }
  };

  const handleEnded = () => {
    console.log('✅ 오디오 재생 끝 → 파일 삭제 요청');
    window.electronAPI.deleteTTS(audioUrl);
    setAudioUrl('');
  };

  const handleStartStream = async () => {
    const result = await window.electronAPI.startStream('test');
    console.log('✅ 송출 시작 응답:', result);
    if (result.status === 'started') setStreaming(true);
  };

  const handleStopStream = async () => {
    const result = await window.electronAPI.stopStream();
    console.log('✅ 송출 중지 응답:', result);
    if (result.status === 'stopped') setStreaming(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Azit Client</h1>

      <button onClick={handleClick}>TTS 실행</button>
      <audio ref={audioRef} onEnded={handleEnded} />

      <div style={{ marginTop: 20 }}>
        <h2>화면 송출</h2>
        <p>감지된 오디오 장치: {audioDevice || '없음'}</p>
        {!streaming ? (
          <button onClick={handleStartStream}>송출 시작</button>
        ) : (
          <button onClick={handleStopStream}>송출 중지</button>
        )}
      </div>
    </div>
  );
}
