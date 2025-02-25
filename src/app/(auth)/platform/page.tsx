"use client";

import React from "react";
import { Container, Grid, Typography, Button, Box } from "@mui/material";
import Image from "next/image";

const AppDownloadPage: React.FC = () => {
  // روابط التنزيل لكل منصة
  const downloadLinks: { [key in "android" | "ios"]: string } = {
    android: "/downloads/app-release.apk",
    ios: "/downloads/app-release.apk",
  };

  // دالة تحميل التطبيق
  const handleDownload = (platform: "android" | "ios") => {
    const link = downloadLinks[platform];

    if (!link) {
      console.error(`رابط التحميل غير متوفر لمنصة: ${platform}`);
      return;
    }

    // إنشاء عنصر <a> وتنزيل الملف
    const anchor = document.createElement("a");
    anchor.href = link;
    anchor.download = link.split("/").pop() || "app-download";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h5" align="center" gutterBottom>
        تحميل التطبيق
      </Typography>

      {/* عرض صور التطبيق بمعدل صورتين في كل صف */}
      <Grid container spacing={3} justifyContent="center">
        {[...Array(6)].map((_, index) => (
          <Grid item key={index} xs={6} md={4} lg={3} sm={3}>
            <Image
              src={`/images/${index + 1}.png`}
              alt={`صورة ${index + 1}`}
              width={130}
              height={300}
              style={{ borderRadius: 8, objectFit: "cover" }}
            />
          </Grid>
        ))}
      </Grid>

      {/* أزرار التحميل في صف واحد */}
      <Box
        sx={{
          mt: 4,
          display: "flex",
          justifyContent: "center",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleDownload("android")}
        >
          تحميل أندرويد
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleDownload("ios")}
        >
          تحميل iOS
        </Button>
      </Box>
    </Container>
  );
};

export default AppDownloadPage;
