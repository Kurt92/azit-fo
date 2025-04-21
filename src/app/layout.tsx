"use client";

import "./globals.css";
import { Header } from "@/wedgets/layout/Header/ui/Header";
import { usePathname } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React, { useState } from "react";
import {UserData} from "@/shared/util/ReactQuery/UserData";
import {user} from "@/shared/util/ApiReq/user/req";
import ChatWidget from "@/wedgets/Chat/ui/ChatWidget";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // QueryClient 전역 설정 (한 번만 생성)
    const [queryClient] = useState(() => new QueryClient());

    return (
        <html lang="en">
        <body>
        <QueryClientProvider client={queryClient}>
            {/* 전체 레이아웃 유지 및 조건에 따른 Header 렌더링 */}
            {pathname === "/login" || pathname === "/login/signup" ? (
                <>
                    {children}
                </>
            ) : (
                <>
                    <Header />
                    <main>
                        {children}
                        <ChatWidget/>
                    </main>

                </>
            )}
            {/* React Query Devtools는 모든 페이지에서 유지 */}
            <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" position="left" />
        </QueryClientProvider>
        </body>
        </html>
    );
}
