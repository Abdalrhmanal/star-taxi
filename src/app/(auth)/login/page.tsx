"use client";

import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  IconButton,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  Avatar
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import useLogin from "../hooks/useLogin";

function LogInPage() {
  const { login, loading, error, success } = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({ email, password });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f9f9f9",
        direction: "rtl",
      }}
    >
      {/* الشعار */}
      <Avatar src="/images/image.png" sx={{ width: 100, height: 100, mb: 2 }} />

      {/* الصندوق الرئيسي */}
      <Box
        sx={{
          width: "600px",
          backgroundColor: "#fff",
          boxShadow: 3,
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        {/* عنوان تسجيل الدخول */}
        <Box sx={{ backgroundColor: "#1976d2", textAlign: "center", py: 2 }}>
          <Typography variant="h5" sx={{ color: "#fff", fontWeight: "bold" }}>
            تسجيل الدخول
          </Typography>
        </Box>

        {/* عرض الأخطاء أو النجاح */}
        <Box sx={{ p: 3 }}>
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          {/* نموذج تسجيل الدخول */}
          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="البريد الإلكتروني"
              type="email"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="كلمة المرور"
              type={showPassword ? "text" : "password"}
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            {/* خيار "تذكرني" */}
            <FormControlLabel
              control={<Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />}
              label="تذكرني"
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{ backgroundColor: "#1976d2", color: "#fff", fontWeight: "bold", py: 1.5 }}
            >
              {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default LogInPage;
