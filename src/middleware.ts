import { NextRequest, NextResponse } from 'next/server';
import axios from "axios";

export async function middleware(req: NextRequest) {
    console.log('check middleware');

    // 토큰 확인 (쿠키에서 가져오기)
    const accToken = req.cookies.get('kurt_access_token');
    const refToken = req.cookies.get('kurt_refresh_token');

    // 리프레시 토큰이 없으면 로그인 페이지로 리다이렉트
    if (!refToken) {
        console.log('리프레시토큰 없뜸!!!!!!!!!!!!!!!!!!!!!');
        return NextResponse.redirect(new URL('/login', req.url)); // 로그인 페이지로 리다이렉트
    }

    // 엑세스 토큰만 없으면 클라이언트에서 갱신 API 호출하도록 계속 진행
    if (!accToken) {
        console.log('엑세스토큰 없뜸!!!!!!!!!!!!!!!!!!!!!!!');

        // axios를 사용했으니 미들웨어는 edge runtime 에서 작동하고, edge runtime에서는 작동하지 않는다고함. (fetch로 변경)
        // axios
        //     .get("/api/auth/token",
        //         { withCredentials: true })
        //     .then((res) => {
        //         console.log(res)
        //     })
        //     .catch(() => {
        //         console.log("failed");
        //     })

        const res = await fetch('http://localhost:3000/api/auth/token', {
            method: 'GET',
            headers: {
                Cookie: req.headers.get('cookie') || '', // 쿠키 전달
            },
        });

        //edge runtime에서는 json 리턴에 Set-Cookie 를 할수 없다함.
        //하여 NextResponse.next() 를 통한 헤더 append를 사용
        // NextResponse.json({ success: true, message: "success" }, {
        //     headers: {
        //         "Set-Cookie": res.headers.get("set-cookie") || "", // 쿠키를 Next.js의 응답 헤더로 전달
        //     }
        // });
        if (res.ok) {
            const data = await res.json();
            console.log('Token refreshed successfully:', data);

            // 새로 받은 쿠키를 설정
            const response = NextResponse.next();
            const setCookieHeader = res.headers.get('set-cookie');

            if (setCookieHeader) {
                response.headers.append('Set-Cookie', setCookieHeader);
            }
            return response;
        } else {
            console.log('토큰 갱신 실패:', res.status);
            return NextResponse.redirect(new URL('/login', req.url));
        }


        // if (res.ok) {
        //     const data = await res.json();
        //     console.log('Token refreshed successfully:', data);
        // } else {
        //     console.log('Failed to refresh token:', res.status);
        // }

        // return NextResponse.next();
    }

    // 모든 토큰이 있는 경우 요청을 계속 진행
    return NextResponse.next();

}

export const config = {
    matcher: ['/api/back/:path*'], // `/api/back` 아래 모든 경로에 대해 미들웨어 적용
};