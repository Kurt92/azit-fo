"use client";

import React from "react";
import { Box, Typography, Button, Paper, useMediaQuery } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { useTheme } from "@mui/material/styles";

export default function DownloadPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (isMobile) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#2B2D31",
        }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 3,
            bgcolor: "#23272A",
            color: "#fff",
            textAlign: "center",
          }}
        >
          <Typography variant="h6" fontWeight={700}>
            이 페이지는 PC에서만 이용할 수 있습니다.
          </Typography>
          <Typography variant="body2" sx={{ color: "#bdbdbd", mt: 2 }}>
            PC 환경에서 접속해 주세요.
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#2B2D31",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 5,
          borderRadius: 3,
          minWidth: 340,
          maxWidth: 400,
          bgcolor: "#23272A",
          color: "#fff",
          textAlign: "center",
        }}
      >
        <Typography variant="h4" fontWeight={700} mb={2}>
          AZIT 다운로드
        </Typography>
        <Typography variant="body1" mb={3} sx={{ color: "#bdbdbd" }}>
          AZIT PC 클라이언트 설치 파일을 다운로드 하세요.<br />
          Windows 10 이상에서 사용 가능합니다.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<DownloadIcon />}
          href="/download/myapp.exe"
          download
          sx={{ fontWeight: 600, fontSize: 18, py: 1.5, px: 4 }}
        >
          EXE 파일 다운로드
        </Button>
      </Paper>
    </Box>
  );
}
