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
    env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL, // .env 파일에서 환경 변수 가져오기
    },
};

module.exports = nextConfig;
