"use client";
import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import HeaderPageD from "@/components/header-page";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

type SocialLink = {
  title: string;
  link: string;
  icon?: File | null;
};

const CreateSocialLinks = () => {
  const [file, setFile] = useState<File | null>(null);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertSeverity, setAlertSeverity] = useState<"error" | "success">("success");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();
  const token = Cookies.get("auth_user");

  const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm<SocialLink>({
    defaultValues: {
      title: "",
      link: "",
      icon: null,
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      
      if (!allowedTypes.includes(selectedFile.type)) {
        setAlertMessage("يرجى اختيار ملف صورة بصيغة JPEG أو PNG.");
        setAlertSeverity("error");
        setOpenAlert(true);
        return;
      }

      if (selectedFile.size > 5 * 1024 * 1024) {
        setAlertMessage("حجم الملف يجب أن يكون أقل من 5MB!");
        setAlertSeverity("error");
        setOpenAlert(true);
        return;
      }

      setFile(selectedFile);
      setValue("icon", selectedFile);
    }
  };

  const handleCreate = async (data: SocialLink) => {
    if (!data.title || !data.link) {
      setAlertMessage("يرجى ملء جميع الحقول المطلوبة!");
      setAlertSeverity("error");
      setOpenAlert(true);
      return;
    }

    if (!file) {
      setAlertMessage("يرجى اختيار صورة!");
      setAlertSeverity("error");
      setOpenAlert(true);
      return;
    }

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("link", data.link);
    formData.append("icon", file);

    try {
      setIsLoading(true);
      const response = await fetch("https://tawsella.online/api/social-links", {
        method: "POST",
        body: formData,
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (response.ok) {
        setAlertMessage("تمت إضافة المنصة بنجاح!");
        setAlertSeverity("success");
        setOpenAlert(true);
        reset();
        setFile(null);
        router.back();
      } else {
        setAlertMessage(`خطأ: ${result.message || "حدث خطأ أثناء الإرسال"}`);
        setAlertSeverity("error");
        setOpenAlert(true);
      }
    } catch (error) {
      setAlertMessage("حدث خطأ أثناء الإرسال، يرجى المحاولة مرة أخرى.");
      setAlertSeverity("error");
      setOpenAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 500, margin: "0 auto", padding: 3 }}>
      <HeaderPageD pluralName="مواقع التواصل الاجتماعية"/>
      <Snackbar
        open={openAlert}
        autoHideDuration={6000}
        onClose={() => setOpenAlert(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setOpenAlert(false)} severity={alertSeverity} sx={{ width: "100%" }}>
          {alertMessage}
        </Alert>
      </Snackbar>

      <Typography variant="h5" gutterBottom sx={{ textAlign: "right" }}>
        إضافة رابط سوشيال ميديا
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Controller
            name="title"
            control={control}
            rules={{ required: "اسم الموقع مطلوب" }}
            render={({ field }) => (
              <TextField
                fullWidth
                label="اسم الموقع"
                variant="outlined"
                {...field}
                error={!!errors.title}
                helperText={errors.title ? errors.title.message : ""}
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Controller
            name="link"
            control={control}
            rules={{ required: "الرابط مطلوب" }}
            render={({ field }) => (
              <TextField
                fullWidth
                label="رابط الموقع"
                variant="outlined"
                type="url"
                {...field}
                error={!!errors.link}
                helperText={errors.link ? errors.link.message : ""}
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <input
            type="file"
            accept="image/jpeg, image/png, image/jpg"
            onChange={handleFileChange}
            style={{ display: "none" }}
            id="upload-button"
          />
          <label htmlFor="upload-button">
            <Button variant="outlined" component="span" fullWidth>
              {file ? file.name : "رفع اللوغو"}
            </Button>
          </label>
        </Grid>

        <Grid item xs={12}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleSubmit(handleCreate)}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : "إضافة"}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CreateSocialLinks;
