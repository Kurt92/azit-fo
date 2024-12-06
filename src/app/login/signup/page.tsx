"use client";

import "./signup.css";
import { useState } from "react";
import { Box, TextField, Button, Typography, Container } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { useRouter } from "next/navigation";

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

export default function SignupPage(): JSX.Element {
    const [accountId, setAccountId] = useState<string>(""); // 아이디
    const [password, setPassword] = useState<string>(""); // 비밀번호
    const [confirmPassword, setConfirmPassword] = useState<string>(""); // 비밀번호 확인
    const [email, setEmail] = useState<string>(""); // 이메일
    const [isIdValid, setIsIdValid] = useState<boolean | null>(null); // 중복 체크 결과
    const [isValidEmail, setIsIdValEmail] = useState<boolean | null>(null);
    const router = useRouter();

    const handleSignup = (): void => {

        if (isIdValid) {
            alert("아이디 중복 체크를 완료해주세요.");
            return;
        }

        if (password !== confirmPassword) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }

        if(!validateEmail(email)){
            alert("이메일형식을 체크해주세요.")
            return;
        }

        axios
            .post("http://ec2-54-180-247-143.ap-northeast-2.compute.amazonaws.com:8011/signup", { accountId, password })
            .then((res) => {
                console.log("Signup successful:", res);
                alert("회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.");
                router.push("/login");
            })
            .catch((err) => {
                console.error("Signup error:", err);
                alert("회원가입에 실패했습니다.");
            });
    };

    const handleDuplicateCheck = (): void => {
        if (!accountId) {
            alert("아이디를 입력해주세요.");
            return;
        }

        axios
            .get(`http://ec2-54-180-247-143.ap-northeast-2.compute.amazonaws.com:8011/duplicate-check`, { params: { accountId: accountId } })
            .then((res) => {
                if (res.data) {
                    alert("이미 사용 중인 아이디입니다.");
                    setIsIdValid(true);
                } else {
                    alert("사용 가능한 아이디입니다.");
                    setIsIdValid(false);
                }
            })
            .catch((err) => {
                console.error("Duplicate check error:", err);
                alert("중복 체크에 실패했습니다.");
            });
    };

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // 간단한 이메일 검증 정규식
        return emailRegex.test(email);
    };

    return (
        <ThemeProvider theme={theme}>
            <div className="signup-container">
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
                        회원가입
                    </Typography>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "1rem",
                        }}
                    >
                        <Box sx={{ display: "flex", gap: "1rem" }}>
                            <TextField
                                label="아이디"
                                variant="filled"
                                value={accountId}
                                error={isIdValid === true}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setAccountId(e.target.value);
                                    setIsIdValid(null); // 아이디 변경 시 중복 체크 상태 초기화
                                }}
                                fullWidth
                                sx={{
                                    backgroundColor: "background.default",
                                    borderRadius: "4px",
                                }}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleDuplicateCheck}
                                sx={{
                                    flexShrink: 0,
                                    fontWeight: "bold",
                                    padding: "0.5rem 1rem",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                중복 체크
                            </Button>
                        </Box>
                        <TextField
                            label="비밀번호"
                            type="password"
                            variant="filled"
                            value={password}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setPassword(e.target.value)
                            }
                            fullWidth
                            sx={{
                                backgroundColor: "background.default",
                                borderRadius: "4px",
                            }}
                        />
                        <TextField
                            label="비밀번호 확인"
                            type="password"
                            variant="filled"
                            value={confirmPassword}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setConfirmPassword(e.target.value)
                            }
                            fullWidth
                            sx={{
                                backgroundColor: "background.default",
                                borderRadius: "4px",
                            }}
                        />
                        <TextField
                            label="이메일"
                            variant="filled"
                            value={email}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setEmail(e.target.value);
                            }}
                            error={isValidEmail === false} // 에러 상태 표시
                            fullWidth
                            sx={{
                                backgroundColor: "background.default",
                                borderRadius: "4px",
                            }}
                        />
                        <Button
                            type="button"
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{
                                fontWeight: "bold",
                                padding: "0.75rem",
                            }}
                            onClick={handleSignup}
                        >
                            회원가입
                        </Button>
                    </Box>
                    <Typography
                        variant="body2"
                        align="center"
                        sx={{ color: "text.primary", marginTop: "1rem" }}
                    >
                        이미 계정이 있으신가요?{" "}
                        <a href="/login" style={{ color: "#888" }}>
                            로그인
                        </a>
                    </Typography>
                </Container>
            </div>
        </ThemeProvider>
    );
}
