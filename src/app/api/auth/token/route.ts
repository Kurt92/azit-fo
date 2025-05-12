import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

interface RefreshTokenResponse {
    success: boolean;
    accessToken?: string;
    message?: string;
}

export async function GET() {

    console.log('auth in');
    const cookieStore = cookies();
    const accessToken = cookieStore.get("kurt_access_token");
    const refreshToken = cookieStore.get("kurt_refresh_token");


    console.log('refreshToken``````````````` : ' + refreshToken);

    if (!refreshToken) {
        return NextResponse.json({ success: false, message: "have to relogin" }, { status: 401 });
    }
    console.log('auth in2');

    try {
        // Auth 서버에 Refresh Token을 사용해 Access Token 요청

        const authDomain = process.env.NEXT_PUBLIC_AUTH_URL;
        const response = await fetch(`${authDomain}/auto-login`, {
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
        console.log('auth in3');
        console.log(response.headers.get("set-cookie"))

        const accessTokenMatch = response.headers.get("set-cookie")?.match(/kurt_access_token=([^;]+)/);
        const accessTokenVal = accessTokenMatch ? accessTokenMatch[1] : null;
        let decodedJWT = null;

        if (!accessTokenVal) {
            console.error("Access token not found in Set-Cookie header.");
        } else {
            try {
                decodedJWT = jwt.verify(accessTokenVal, process.env.JWT_SECRET as string); // JWT 검증 및 디코딩
                console.log("Decoded Token:", decodedJWT); // 디코딩된 정보 출력
            } catch (error) {
                console.error("Invalid or expired token");
            }
        }

        console.log()

        const text = await response.text();
        return NextResponse.json({ success: true, message: text, user: decodedJWT}, {
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
