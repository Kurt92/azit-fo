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
    // 이거 .evn 에 public 붙이면 자동으로 처리됨. 따라서 주석처리
    // env: {
    //     // .env 파일에서 환경 변수 가져오기
    //     NEXT_AUTH_URL: process.env.NEXT_AUTH_URL,
    //     NEXT_API_URL: process.env.NEXT_API_URL,
    //     NEXT_GATEWAY_URL: process.env.NEXT_GATEWAY_URL,
    // },
};

module.exports = nextConfig;
