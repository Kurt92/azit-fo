"use client";
// export const dynamic = "force-dynamic"; // 기본 레이아웃 비활성화

import "./login.css"
import {useEffect, useState} from "react";
import { Box, TextField, Button, Typography, Container } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { useRouter } from "next/navigation";
import {UserData} from "@/shared/util/ReactQuery/UserData";
import {user} from "@/shared/util/ApiReq/user/req";

// MUI 테마 커스터마이징
const theme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#555",
        },
        secondary: {
            main: "#333",
        },
        text: {
            primary: "#ffffff",
        },
        background: {
            default: "#333",
            paper: "#444",
        },
    },
});

export default function Page() {
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    const { data: userData, isLoading: isUserLoading, isError: isUserError } = UserData(["userData"], user);


    let login = () => {
        const domain = process.env.NEXT_PUBLIC_AUTH_URL;
        axios
            .post(`${domain}/auth/login`,
                {id, password},
                { withCredentials: true })
            .then((res) => {
                console.log(res)
                router.push("/")
            })
            .catch(() => {
                console.log("failed");
            })

    }

    const handleSubmit = () => {
        // e.preventDefault();
        console.log("Submitted Data:", { id, password });
    };
    const checkRefToken = async() => {
        try {
            const res = await axios.get(
                "/api/auth/token",
                {withCredentials: true,}
            );

            if(res.status === 200) {
                // router.push("/")
                console.log(res);
            } else console.log("Token nsot found.");
        } catch (err) {console.error("ref token find err", err);}
    }

    useEffect(() => {

        // 직접 auth 서버 호출하는 방식에서 리엑트쿼리로 변경


        if (isUserLoading) console.log("Loading...");
        if (isUserError) {
            console.log("Error fetching token!");
            checkRefToken();


        }
        if (userData) {
            console.log("Account ID:", userData);
            router.back();
        }



    }, [userData, isUserLoading, isUserError]);


    return (
        <ThemeProvider theme={theme}>
            <div className={"login-container"}>
                <Container
                    maxWidth="sm"
                    sx={{
                        backgroundColor: "background.paper",
                        padding: "2rem",
                        borderRadius: "8px",
                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.5), 0px 1px 3px rgba(50, 50, 93, 0.25)",
                    }}
                >
                    <Typography
                        variant="h4"
                        component="h1"
                        gutterBottom
                        align="center"
                        sx={{ color: "text.primary", marginBottom: "1rem" }}
                    >
                        로그인
                    </Typography>
                    <Box
                        // component="form"
                        onSubmit={handleSubmit}
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "1rem",
                        }}
                    >
                        <TextField
                            label="아이디"
                            variant="filled"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            fullWidth
                            sx={{
                                backgroundColor: "background.default",
                                borderRadius: "4px",
                            }}
                        />
                        <TextField
                            label="비밀번호"
                            type="password"
                            variant="filled"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            fullWidth
                            sx={{
                                backgroundColor: "background.default",
                                borderRadius: "4px",
                            }}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{
                                fontWeight: "bold",
                                padding: "0.75rem",
                            }}
                            onClick={login}
                        >
                            로그인
                        </Button>
                    </Box>
                    <Typography
                        variant="body2"
                        align="center"
                        sx={{ color: "text.primary", marginTop: "1rem" }}
                    >
                        계정이 없으신가요?{" "}
                        <a href="/login/signup" style={{ color: "#888" }}>
                            회원가입
                        </a>
                    </Typography>
                </Container>
            </div>
        </ThemeProvider>
    );
}
