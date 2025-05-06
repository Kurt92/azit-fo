"use client";

import "./signup.css";
import {useEffect, useState} from "react";
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

    const [authCodeSent, setAuthCodeSent] = useState<boolean>(false);
    const [authCode, setAuthCode] = useState<string>("");
    const [inputCode, setInputCode] = useState<string>("");
    const [timer, setTimer] = useState<number>(180); // 3분 = 180초

    //회원가입 요청
    const handleSignup = (): void => {

        if (!isIdValid) {
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

        const authDomain = process.env.NEXT_PUBLIC_AUTH_URL;
        axios
            .post(`${authDomain}/signup`, { accountId, password })
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

        const authDomain = process.env.NEXT_PUBLIC_AUTH_URL;
        axios
            .get(`${authDomain}/duplicate-check`, { params: { accountId: accountId } })
            .then((res) => {
                if (res.data) {
                    alert("이미 사용 중인 아이디입니다.");
                    setIsIdValid(false);
                } else {
                    alert("사용 가능한 아이디입니다.");
                    setIsIdValid(true);
                }
            })
            .catch((err) => {
                console.error("Duplicate check error:", err);
                alert("중복 체크에 실패했습니다.");
            });
    };

    // 이메일 인증 요청
    const handleEmailVerifyCodeSend = () => {
        if (!validateEmail(email)) {
            alert("이메일 형식을 확인해주세요.");
            return;
        }

        const authDomain = process.env.NEXT_PUBLIC_AUTH_URL;
        axios
            .get(`${authDomain}/email-verify-code-send`, {
                params: {
                    email: email
                }
            })
            .then(() => {
                alert("인증 메일이 전송되었습니다.");
                setAuthCodeSent(true);
                setTimer(180); // 3분
            })
            .catch((err) => {
                console.error("이메일 인증 요청 실패", err);
                alert("이메일 인증 요청에 실패했습니다.");
            });
    };

    // 인증번호 검증 요청
    const verifyEmailCode = () => {
        const authDomain = process.env.NEXT_PUBLIC_AUTH_URL;
        axios
            .get(`${authDomain}/email-verify-code-check`, {
                params: {
                    email: email,
                    code: inputCode
                }
            })
            .then((res) => {
                alert("이메일 인증이 완료되었습니다.");
                setIsIdValEmail(true);
            })
            .catch((err) => {
                console.error("인증번호 검증 실패", err);
                alert("인증번호가 틀렸거나 만료되었습니다.");
            });
    };

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // 간단한 이메일 검증 정규식
        return emailRegex.test(email);
    };

    // 타이머 로직
    useEffect(() => {
        if (authCodeSent && timer > 0) {
            const interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        } else if (authCodeSent && timer === 0) {
            setAuthCodeSent(false); // 타이머 끝났을 때 버튼 초기화
            alert("인증 시간이 만료되었습니다. 다시 요청해주세요.");
        }
    }, [authCodeSent, timer]);


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
                                error={isIdValid === false}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setAccountId(e.target.value);
                                    setIsIdValid(null); // 아이디 변경 시 중복 체크 상태 초기화
                                }}
                                fullWidth
                                sx={{
                                    backgroundColor: "background.default",
                                    borderRadius: "4px",
                                    "& .MuiFilledInput-root": {
                                        border: isIdValid ? "2px solid green" : undefined,
                                    },
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
                        <Box sx={{ display: "flex", gap: "1rem"}}>
                            <TextField
                                label="이메일"
                                variant="filled"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                error={isValidEmail === false}
                                fullWidth
                                sx={{
                                    backgroundColor: "background.default",
                                    borderRadius: "4px",
                                    "& .MuiFilledInput-root": {
                                        border: isValidEmail ? "2px solid green" : undefined,
                                    },
                                }}
                            />


                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleEmailVerifyCodeSend}
                                sx={{
                                    flexShrink: 0,
                                    fontWeight: "bold",
                                    padding: "0.5rem 1rem",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {authCodeSent && !isValidEmail ? `${Math.floor(timer / 60)}:${(timer % 60).toString().padStart(2, "0")}` : "인증 요청"}
                            </Button>
                        </Box>

                        {authCodeSent && !isValidEmail && (
                            <Box sx={{ display: "flex", alignItems: "center", gap: "1rem", mt: 1 }}>
                                <TextField
                                    label="인증번호"
                                    variant="filled"
                                    value={inputCode}
                                    onChange={(e) => setInputCode(e.target.value)}
                                    fullWidth
                                    sx={{
                                        backgroundColor: "background.default",
                                        borderRadius: "4px",
                                    }}
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={verifyEmailCode}
                                    sx={{
                                        flexShrink: 0,
                                        fontWeight: "bold",
                                        padding: "0.5rem 1rem",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    인증번호 확인
                                </Button>
                            </Box>
                        )}
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
