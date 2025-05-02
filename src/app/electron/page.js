'use client';

import { useState, useRef } from 'react';

export default function ElectronPage() {
  const [audioUrl, setAudioUrl] = useState('');
  const audioRef = useRef(null);

  const handleClick = async () => {
    const url = await window.electronAPI.requestTTS("안녕하세요 Test 입니다. 하찮은 휴먼 ");
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

  return (
    
    <div style={{ padding: 20 }}>
      <h1>Azit Client</h1>
      <button onClick={handleClick}>TTS 실행</button>
      <audio ref={audioRef} onEnded={handleEnded} />
    </div>
  );
}
