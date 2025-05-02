//리엑트 19버전 -> 18버전으로 내리면서 ts 형식의 콘프를 지원안한다고함. 파일 js로 바꾸고 아래콘프 익스포트

// import type { NextConfig } from "next";
//
// const nextConfig: NextConfig = {
//   /* config options here */
// };
//
// export default nextConfig;


/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false, // Strict Mode 비활성화
    // .evn 에 public 붙이면 자동으로 처리됨. 따라서 주석처리
    // 주석을 했는데 build 는 프로덕션이라서 자동으로 읽지 않는다고함(next dev에서만 자동적용) 그래서 해제함
    env: {
        // .env 파일에서 환경 변수 가져오기
        NEXT_PUBLIC_AUTH_URL: process.env.NEXT_PUBLIC_AUTH_URL,
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
        NEXT_PUBLIC_CHAT_URL: process.env.NEXT_PUBLIC_CHAT_URL,
        NEXT_PUBLIC_GATEWAY_URL: process.env.NEXT_PUBLIC_GATEWAY_URL,
    },
};

module.exports = nextConfig;
