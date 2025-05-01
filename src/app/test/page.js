'use client';

import { IconButton } from '@mui/material';
export default function electest() {


  // const handleClick = async () => {
  //   const res = await fetch('https://api.azitbase.com/api/tts', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ text: 'tts 테스트 입니다. 휴먼' })
  //   });

  //   if (res.ok) {
  //     console.log('API 서버에 TTS 요청 전송 성공');
  //   } else {
  //     console.error('TTS 요청 실패');
  //   }
  // };

  const handleClick = () => {
    window.electronAPI.sendTTS("tts 테스트 입니다. 휴먼");
  };

    return (
        <>
        <div style={{ padding: 20 }}>
            <h1>tts 테스트</h1>
            <IconButton onClick={handleClick}>TTS 실행</IconButton>
        </div>
      </>
    );
}