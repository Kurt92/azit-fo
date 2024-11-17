import { cookies } from "next/headers";
import { NextResponse } from "next/server";

interface RefreshTokenResponse {
    success: boolean;
    accessToken?: string;
    message?: string;
}

export async function GET() {

    const cookieStore = cookies();
    const refreshToken = cookieStore.get("kurt_refresh_token");

    if (!refreshToken) {
        return NextResponse.json({ success: false, message: "have to relogin" }, { status: 401 });
    }

    try {
        // Auth 서버에 Refresh Token을 사용해 Access Token 요청
        const response = await fetch("http://localhost:8011/auth/auto-login", {
            method: "GET",
            credentials: "include", // 쿠키를 포함
            headers: {
                "Content-Type": "application/json",
                "Cookie": `kurt_refresh_token=${refreshToken.value}`, // 쿠키를 수동으로 전달
            },
        });

        if (!response.ok) {
            throw new Error("Failed to refresh token");
        }

        const text = await response.text();
        return NextResponse.json({ success: true, message: text }, {
            headers: {
                "Set-Cookie": response.headers.get("set-cookie") || "", // 쿠키를 Next.js의 응답 헤더로 전달
            },
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: (error as Error).message },
            { status: 500 }
        );
    }
}
