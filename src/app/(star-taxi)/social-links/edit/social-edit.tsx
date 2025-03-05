"use client";
import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  CircularProgress,
  Box,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  Input,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import Cookies from "js-cookie";

interface SocialLink {
  id: string;
  title: string;
  link: string;
  icon: File | null;
}

const token = Cookies.get("auth_user");

const EditSocialLinks = ({ data, onSuccess }: { data: SocialLink; onSuccess?: () => void }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<SocialLink>({
    defaultValues: { id: "", title: "", link: "", icon: null },
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [alert, setAlert] = useState<{ message: string; severity: "success" | "error" } | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (data) {
      setValue("id", data.id);
      setValue("title", data.title);
      setValue("link", data.link);
    }
  }, [data, setValue]);

  const handleUpdate = async (updatedData: SocialLink) => {
    if (!updatedData.title || !updatedData.link) {
      setAlert({ message: "يرجى ملء جميع الحقول المطلوبة!", severity: "error" });
      return;
    }

    const formData = new FormData();
    formData.append("title", updatedData.title);
    formData.append("link", updatedData.link);
    if (selectedFile) formData.append("icon", selectedFile);

    try {
      setIsLoading(true);
      const response = await fetch(`https://tawsella.online/api/social-links/${data.id}`, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
      });

      const result = await response.json();
      if (response.ok) {
        setAlert({ message: "تم التحديث بنجاح!", severity: "success" });
        reset();
        setSelectedFile(null);
        onSuccess?.();
      } else {
        setAlert({ message: `خطأ: ${result.message || "حدث خطأ أثناء التحديث"}`, severity: "error" });
      }
    } catch {
      setAlert({ message: "حدث خطأ أثناء الإرسال، يرجى المحاولة مرة أخرى.", severity: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        setAlert({ message: "يرجى اختيار ملف صورة بصيغة JPEG أو PNG.", severity: "error" });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setAlert({ message: "حجم الملف يجب أن يكون أقل من 5MB!", severity: "error" });
        return;
      }
      setSelectedFile(file);
      setValue("icon", file);
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 600, margin: "0 auto" }}>
      <Snackbar open={!!alert} autoHideDuration={6000} onClose={() => setAlert(undefined)}>
        {alert && <Alert severity={alert.severity}>{alert.message}</Alert>}
      </Snackbar>

      <Typography variant="h4" gutterBottom align="right">
        تعديل رابط التواصل الاجتماعي
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Controller
            name="title"
            control={control}
            rules={{ required: "العنوان مطلوب" }}
            render={({ field }) => (
              <TextField fullWidth label="العنوان" variant="outlined" {...field} error={!!errors.title} helperText={errors.title?.message} />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Controller
            name="link"
            control={control}
            rules={{ required: "الرابط مطلوب" }}
            render={({ field }) => (
              <TextField fullWidth label="الرابط" variant="outlined" {...field} error={!!errors.link} helperText={errors.link?.message} />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel htmlFor="icon-input">الأيقونة (اختياري)</InputLabel>
            <Input id="icon-input" type="file" inputProps={{ accept: "image/*" }} onChange={handleFileChange} />
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Button fullWidth variant="contained" color="primary" onClick={handleSubmit(handleUpdate)} disabled={isLoading}>
            {isLoading ? <CircularProgress size={24} color="inherit" /> : "تحديث"}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EditSocialLinks;
