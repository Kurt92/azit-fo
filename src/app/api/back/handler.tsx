import axios, { AxiosError } from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
    const token = req.cookies.get('accessToken'); // HTTP-only 쿠키에서 토큰 가져오기

    // 토큰이 없는 경우 401 응답
    if (!token) {
        return NextResponse.json(
            { message: 'Unauthorized. Token is missing.' },
            { status: 401 }
        );
    }

    // 토큰이 있는 경우 요청을 계속 처리
    return NextResponse.next();
}

export async function GET(req: NextRequest) {
    const path = req.nextUrl.pathname.replace('/api/', ''); // `/api/`를 제거한 경로 추출
    const apiUrl = `http://localhost:8080/${path}`; // 8080 API 서버 URL

    try {
        // API 서버로 요청 전달
        const response = await axios.get(apiUrl, {
            headers: {
                Authorization: `Bearer ${req.cookies.get('accessToken') || ''}`, // 토큰 전달
            },
        });

        // API 서버 응답 반환
        return NextResponse.json(response.data);
    } catch (error: any) {
        const axiosError = error as AxiosError;

        // 401 응답 처리 (갱신 시도)
        if (axiosError.response?.status === 401) {
            try {
                const refreshResponse = await axios.post(
                    'http://localhost:8011/auth/auto-login',
                    {},
                    {
                        headers: {
                            Cookie: req.headers.get('cookie') || '',
                        },
                    }
                );

                // 새 엑세스 토큰 설정
                const newToken = refreshResponse.data.accessToken;

                return NextResponse.json(
                    { message: 'Token refreshed successfully' },
                    {
                        headers: {
                            'Set-Cookie': `accessToken=${newToken}; HttpOnly; Path=/; SameSite=Strict`,
                        },
                    }
                );
            } catch (refreshError) {
                return NextResponse.json(
                    { message: 'Session expired. Please log in again.' },
                    { status: 401 }
                );
            }
        }

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
