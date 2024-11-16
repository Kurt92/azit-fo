import { cookies } from "next/headers";
import { NextResponse } from "next/server";

interface RefreshTokenResponse {
    success: boolean;
    accessToken?: string;
    message?: string;
}

export async function POST() {
    const cookieStore = cookies();
    const refreshToken = cookieStore.get("kurt_refresh_token")?.value;

    console.log(refreshToken);

    if (!refreshToken) {
        return NextResponse.json({ success: false, message: "No refresh token found" }, { status: 401 });
    }

    try {
        // Auth 서버에 Refresh Token을 사용해 Access Token 요청
        const response = await fetch("http://localhost:8011/auth/auto-login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ refreshToken }),
        });

        if (!response.ok) {
            throw new Error("Failed to refresh token");
        }

        // Response 데이터 타입 명시
        const data: RefreshTokenResponse = await response.json();

        return NextResponse.json({ success: true, accessToken: data.accessToken });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: (error as Error).message },
            { status: 500 }
        );
    }
}
