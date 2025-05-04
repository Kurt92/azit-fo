//리엑트 19버전 -> 18버전으로 내리면서 ts 형식의 콘프를 지원안한다고함. 파일 js로 바꾸고 아래콘프 익스포트

// import type { NextConfig } from "next";
//
// const nextConfig: NextConfig = {
//   /* config options here */
// };
//
// export default nextConfig;


/** @type {import('next').NextConfig} */
if (process.env.NODE_ENV === 'production') {
    require('dotenv').config({ path: '.env.production' });
} else {
    require('dotenv').config();  // 기본 .env.local, .env 등 자동으로 찾아 로드
}
const nextConfig = {
    reactStrictMode: false, // Strict Mode 비활성화
    // .evn 에 public 붙이면 자동으로 처리됨. 따라서 주석처리
    // 주석을 했는데 build 는 프로덕션이라서 자동으로 읽지 않는다고함(next dev에서만 자동적용) 그래서 해제함
    // 최종 
    // prod에서건 dev에서건 .local은 무조건 읽힘.
    // 그래서 자꾸 프로드에서 localhost를 불러왔던거임.
    // .local은 무조건 읽고 최우선 적용이고, 그래서 .devlopment로 바꿈. 
    // (dev에서는 .devlopment로 읽고 prod에서는 .production으로 읽음)
    // 그래서 사실상 이 객체 설정파일은 필요없음.
    env: {
        // .env 파일에서 환경 변수 가져오기
        NEXT_PUBLIC_AUTH_URL: process.env.NEXT_PUBLIC_AUTH_URL,
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
        NEXT_PUBLIC_CHAT_URL: process.env.NEXT_PUBLIC_CHAT_URL,
        NEXT_PUBLIC_GATEWAY_URL: process.env.NEXT_PUBLIC_GATEWAY_URL,
    },
};

module.exports = nextConfig;
