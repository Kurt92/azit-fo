import axios, { AxiosError } from 'axios';
import { NextRequest, NextResponse } from 'next/server';

// 보면 [...path]라는 경로로 디렉토리를 만들었지??
// 이건 api/back/ 아래 있는 모든 요청에 대한 이라는 뜻임
// 디렉토리명을 저렇게 만들어주면 next에서 [Catch-All 라이팅] 으로 설정됨

//근데 미들웨어 설정하는걸로 해당 코드는 필요가 없을꺼같음

// 제거하게된 과정..

// 1. 백엔드 api서버를 찌를때 토큰유무 확인을 해야했음.
// 2. 근데 클라이언트에서는 토큰에 접근이 안됨(http only)
// 3. 그럼 next.js api에 프록시를 만들어서 여기서 체크를 하자.
// 4. 여기서 요청 치환 및 토큰 유무확인을 진행하자.
// 5. 구현을 다 완료하고 보니 미들웨어라는걸 알게 되었음
// 6. 미들웨어도 구현해보자 해서 구현했는데
// 7. 미들웨어에 matcher 로 프록시를 안거치고 넘겨도 되겠다라는 생각을함
// 8. 근데 matcher 가 next 내부 api에 대한 요청만 가로챈다네... 복구함
// 9. 최종적으로 토큰처리는 미들웨어 > auth/token에서 처리하고, 이 프록시는 엔드포인트 치환해주는 목적으로 진행

export async function GET(req: NextRequest) {
    // 요청 경로에서 `/api/` 부분 제거
    const path = req.nextUrl.pathname.replace('/api/back/', '');
    const apiUrl = `http://localhost:8080/${path}`; // 8080 API 서버의 엔드포인트

    console.log('check get')
    try {
        // 8080 서버로 요청 전달
        const response = await axios.get(apiUrl, {
            headers: {
                Authorization: `Bearer ${req.cookies.get('accessToken') || ''}`, // 토큰 전달
            },
        });

        // 8080 API 응답을 클라이언트로 전달
        return NextResponse.json(response.data);
    } catch (error: any) {
        const axiosError = error as AxiosError;

        // 401 토큰 갱신
        // if (axiosError.response?.status === 401) {
        //     try {
        //         // 토큰 갱신 요청
        //         const refreshResponse = await axios.get(
        //             "/api/auth/token",
        //             {withCredentials: true,}
        //         );
        //
        //         console.log(refreshResponse.data.accessToken)
        //
        //         // 새 엑세스 토큰 설정
        //         const newToken = refreshResponse.data.accessToken;
        //
        //         return NextResponse.json(
        //             { message: 'Token refreshed successfully' },
        //             {
        //                 headers: {
        //                     'Set-Cookie': `accessToken=${newToken}; HttpOnly; Path=/; SameSite=Strict`,
        //                 },
        //             }
        //         );
        //     } catch (refreshError) {
        //         return NextResponse.json(
        //             { message: 'Session expired. Please log in again.' },
        //             { status: 401 }
        //         );
        //     }
        // }

        return NextResponse.json(
            { message: axiosError.message || 'Internal Server Error' },
            { status: axiosError.response?.status || 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    const path = req.nextUrl.pathname.replace('/api/', ''); // `/api/`를 제거한 경로 추출
    const apiUrl = `http://localhost:8080/${path}`; // 8080 API 서버 URL

    try {
        const body = await req.json(); // 클라이언트 요청 본문 읽기
        const response = await axios.post(apiUrl, body, {
            headers: {
                Authorization: `Bearer ${req.cookies.get('accessToken') || ''}`, // 토큰 전달
            },
        });

        return NextResponse.json(response.data);
    } catch (error: any) {
        const axiosError = error as AxiosError;
        return NextResponse.json(
            { message: axiosError.message || 'Internal Server Error' },
            { status: axiosError.response?.status || 500 }
        );
    }
}
