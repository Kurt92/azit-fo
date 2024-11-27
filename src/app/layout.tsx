"use client";

import "./globals.css";
import { Header } from "@/wedgets/layout/Header/ui/Header";
import { usePathname } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [queryClient] = useState(() => new QueryClient());

    // 로그인 페이지에서는 레이아웃 비활성화
    if (pathname === "/login" || pathname === "/login/signup") {
        return (
            <html lang="en">
                <body>
                    {children}
                </body>
            </html>
        );
    }

    return (
        <html lang="en">
            <body>
                <Header/>
                <QueryClientProvider client={queryClient}>
                    <main>{children}</main>
                </QueryClientProvider>
            </body>
        </html>
    );
}
