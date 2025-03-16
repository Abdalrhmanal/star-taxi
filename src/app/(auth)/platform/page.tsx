"use client";

import React, { useState } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Paper,
  Dialog,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import Image from "next/image";
import { styled } from "@mui/material/styles";
import AndroidIcon from "@mui/icons-material/Android";
import AppleIcon from "@mui/icons-material/Apple";
import ShareIcon from "@mui/icons-material/Share";

// Styled components
const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(6),
  marginBottom: theme.spacing(6),
  direction: "rtl",
  textAlign: "center",
}));

const HeaderContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(5),
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
    textAlign: "center",
  },
}));

const HeaderInfo = styled(Box)(({ theme }) => ({
  textAlign: "right",
  [theme.breakpoints.down("md")]: {
    textAlign: "center",
    marginTop: theme.spacing(2),
  },
}));

const GridItem = styled(Paper)(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "scale(1.03)",
    "& .overlay": {
      opacity: 1,
    },
  },
}));

const ImageOverlay = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0, 0, 0, 0.5)",
  color: "white",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  opacity: 0,
  transition: "opacity 0.3s ease",
  padding: theme.spacing(2),
}));

const AndroidButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#3b5998",
  color: "white",
  "&:hover": {
    backgroundColor: "#2d4373",
  },
}));

const IosButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#00aced",
  color: "white",
  "&:hover": {
    backgroundColor: "#0084b4",
  },
}));

const ShareButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#f5f5f5",
  color: "#333",
  "&:hover": {
    backgroundColor: "#e0e0e0",
  },
}));

function AppDownloadPage() {
  const [openDialog, setOpenDialog] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [downloadPlatform, setDownloadPlatform] = useState<"android" | "ios" | null>(null);
  
  // روابط التنزيل لكل منصة
  const downloadLinks: { [key in "android" | "ios"]: string } = {
    android: "/downloads/app-release.apk",
    ios: "/downloads/app-release.ipa",
  };

  // بدء عملية التنزيل مع العد التنازلي
  const startDownload = (platform: "android" | "ios") => {
    setDownloadPlatform(platform);
    setCountdown(10);
    setOpenDialog(true);
    
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleDownload(platform);
          setOpenDialog(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
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
    
    // إظهار رسالة نجاح
    alert(`تم تحميل التطبيق لـ ${platform === "android" ? "أندرويد" : "iOS"} بنجاح!`);
  };

  // نسخ رابط الصفحة
  const copyLink = () => {
    const link = window.location.href;
    navigator.clipboard.writeText(link)
      .then(() => {
        alert('تم نسخ الرابط بنجاح!');
      })
      .catch(err => {
        console.error('فشل في نسخ النص: ', err);
      });
  };

  // محتوى الصور والعناوين
  const imageContents = [
    { title: "الحصول على الدعم", description: "ستجد اولا الواجهات الترحيبية و التعريفية بالتطبيق بالكامل" },
    { title: "تسجيل الدخول", description: "هنا يتطلب منك القيام  بادخال معلومات حسابك الذي تم انشائه مسبقا قم بادخال البريد الالكتروني و كلمة المرور" },
    { title: "في الواجهة الرئيسية ", description: "هنا ستظهر لك اهم الاعلانات و الخصومات و العروضات ضمن مدينة حلب " },
    { title: "طلب سيارة", description: "هنا يتوجب عليك ادخال بيانات الطلب التي ستقوم به يجب ان تقوم بتحديد الوجهة الى اين تريد ان تذهب على الخريطة من خلال النقر على اقرب عنوان تريد الوصول اليه" },
    { title: "اسعار الرحلات ", description: "هنا ستجد اسعار الطلبات الثابتة من حلب الى المدن والبلدات الرئيسية حول حلب وفي سوريا " },
    { title: "صفحة ملفك الشخصي", description: "من هذه الصفحة تستطيع استعراض معلومات حسابك ضمن التطبيق وادارته " },
  ];

  return (
    <StyledContainer maxWidth="lg">
      {/* رأس الصفحة مع شعار التطبيق والمعلومات */}
      <HeaderContainer>
        <Box
          sx={{
            position: "relative",
            width: 200,
            height: 200,
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <Image
            src="/images/logo.png"
            alt="التطبيق الرئيسي"
            width={200}
            height={200}
            style={{ objectFit: "cover" }}
          />
        </Box>
        
        <HeaderInfo>
          <Typography variant="h4" component="h2" gutterBottom>
            Star Taxi
          </Typography>
          <Typography variant="body1" gutterBottom>
            تقييم: 4.7 نجوم
          </Typography>
          <Typography variant="body1" gutterBottom>
            عدد التحميلات: 100,000+
          </Typography>
          
          <Box sx={{ mt: 2, display: "flex", gap: 1, justifyContent: { xs: "center", md: "flex-start" } }}>
            <ShareButton 
              variant="contained" 
              startIcon={<ShareIcon />}
              onClick={copyLink}
            >
              شارك
            </ShareButton>
            <AndroidButton 
              variant="contained" 
              startIcon={<AndroidIcon />}
              onClick={() => startDownload("android")}
            >
              تحميل أندرويد
            </AndroidButton>
            <IosButton 
              variant="contained" 
              startIcon={<AppleIcon />}
              onClick={() => startDownload("ios")}
            >
              تحميل iOS
            </IosButton>
          </Box>
        </HeaderInfo>
      </HeaderContainer>

      {/* عرض صور التطبيق مع تأثير التمرير */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {imageContents.map((content, index) => (
          <Grid item key={index} xs={12} sm={6} md={4}>
            <GridItem elevation={2} sx={{ height: 600 ,p:1 }}>
              <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
                <Image
                  src={`/images/${index + 1}.png`}
                  alt={`صورة ${index + 1}`}
                  fill
                  sizes="(max-width: 600px) 100vw, (max-width: 960px) 50vw, 33vw"
                  style={{ objectFit: "cover" }}
                  priority={index < 2} // Prioritize loading first two images
                />
                <ImageOverlay className="overlay">
                  <Typography variant="h6" component="h3" gutterBottom>
                    {content.title}
                  </Typography>
                  <Typography variant="body2">
                    {content.description}
                  </Typography>
                </ImageOverlay>
              </Box>
            </GridItem>
          </Grid>
        ))}
      </Grid>

      {/* أزرار التحميل في الأسفل */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 2,
          flexWrap: "wrap",
          mb: 5,
        }}
      >
        <AndroidButton 
          variant="contained" 
          size="large"
          startIcon={<AndroidIcon />}
          onClick={() => startDownload("android")}
        >
          تحميل أندرويد
        </AndroidButton>
        <IosButton 
          variant="contained" 
          size="large"
          startIcon={<AppleIcon />}
          onClick={() => startDownload("ios")}
        >
          تحميل iOS
        </IosButton>
        <ShareButton 
          variant="contained" 
          size="large"
          startIcon={<ShareIcon />}
          onClick={copyLink}
        >
          شارك
        </ShareButton>
      </Box>

      {/* وصف التطبيق */}
      <Box sx={{ textAlign: "right", mb: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          لمحة عن التطبيق
        </Typography>
        <Typography variant="body1" paragraph>
          هذا التطبيق من اجل توفير خدمة النقل الداخلي في سوريا والتي تعتبر من اهم الخدمات التي يحتاجها المواطن
          السوري في حياته اليومية.
          يمكنك تحميل التطبيق من خلال الروابط اعلاه والتي تحتوي على اخر اصدار من التطبيق.
        </Typography>
      </Box>

      {/* نافذة العد التنازلي */}
      <Dialog
        open={openDialog}
        aria-labelledby="countdown-dialog-title"
        aria-describedby="countdown-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="countdown-dialog-description">
            سيتم تحميل التطبيق بعد {countdown} ثانية.
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </StyledContainer>
  );
}

export default AppDownloadPage;