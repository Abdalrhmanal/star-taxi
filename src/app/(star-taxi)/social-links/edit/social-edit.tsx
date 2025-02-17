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
  Input,
  FormControl,
  InputLabel,
  Snackbar,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import useCreateData from "@/hooks/post-global";

type SocialLink = {
  id: string;
  title: string;
  link: string;
  icon: File | null; // تغيير النوع إلى File
};

const EditSocialLinks = ({ data }: { data: SocialLink }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<SocialLink>({
    defaultValues: {
      id: "",
      title: "",
      link: "",
      icon: null,
    },
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null); // حالة لتخزين الملف المحدد
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertSeverity, setAlertSeverity] = useState<"error" | "success">("success");

  // تعيين القيم الأولية عند تحميل البيانات
  useEffect(() => {
    if (data) {
      setValue("id", data.id);
      setValue("title", data.title);
      setValue("link", data.link);
      // لا نقوم بتعيين قيمة icon هنا لأنها ستكون ملفًا
    }
  }, [data, setValue]);

  const { isLoading, isError, success, createData } = useCreateData<FormData>({
    dataSourceName: `api/social-links/${data.id}`, // مسار API لتحديث الرابط
  });

  const handleUpdate = async (updatedData: SocialLink) => {
    if (!updatedData.title || !updatedData.link) {
      setAlertMessage("يرجى ملء جميع الحقول المطلوبة!");
      setAlertSeverity("error");
      setOpenAlert(true);
      return;
    }

    const formData = new FormData(); // إنشاء FormData لإرسال الملف

    // إضافة الحقول إلى FormData
    formData.append("title", updatedData.title);
    formData.append("link", updatedData.link);
    if (selectedFile) {
      formData.append("icon", selectedFile); // إضافة الملف إذا تم اختياره
    }

    try {
      const response = await fetch(`https://tawsella.online/api/social-links/${data.id}`, {
        method: "POST",
        body: formData,
        headers: {
          "Accept": "application/json",
          "Authorization": "Bearer 17|c8mxBjLNEJwNn6XaACZ2EHWXrl5gujs517Zw8O4Ue3b7f312",
        },
      });

      const result = await response.json();
      if (response.ok) {
        setAlertMessage("تم التحديث بنجاح!");
        setAlertSeverity("success");
        setOpenAlert(true);
      } else {
        setAlertMessage(`خطأ: ${result.message || "حدث خطأ أثناء التحديث"}`);
        setAlertSeverity("error");
        setOpenAlert(true);
      }
    } catch (error) {
      setAlertMessage("حدث خطأ أثناء التحديث، يرجى المحاولة مرة أخرى.");
      setAlertSeverity("error");
      setOpenAlert(true);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
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

      setSelectedFile(selectedFile);
      setValue("icon", selectedFile);
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 600, margin: "0 auto" }}>
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

      <Typography variant="h4" gutterBottom sx={{ textAlign: "right" }}>
        تعديل رابط التواصل الاجتماعي
      </Typography>

      <Grid container spacing={2}>
        {/* حقل العنوان */}
        <Grid item xs={12}>
          <Controller
            name="title"
            control={control}
            rules={{ required: "العنوان مطلوب" }}
            render={({ field }) => (
              <TextField
                fullWidth
                label="العنوان"
                variant="outlined"
                {...field}
                error={!!errors.title}
                helperText={errors.title ? errors.title.message : ""}
                sx={{ textAlign: "right" }}
              />
            )}
          />
        </Grid>

        {/* حقل الرابط */}
        <Grid item xs={12}>
          <Controller
            name="link"
            control={control}
            rules={{ required: "الرابط مطلوب" }}
            render={({ field }) => (
              <TextField
                fullWidth
                label="الرابط"
                variant="outlined"
                {...field}
                error={!!errors.link}
                helperText={errors.link ? errors.link.message : ""}
                sx={{ textAlign: "right" }}
              />
            )}
          />
        </Grid>

        {/* حقل الأيقونة (اختياري) */}
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel htmlFor="icon-input" sx={{ textAlign: "right" }}>
              الأيقونة (اختياري)
            </InputLabel>
            <Input
              id="icon-input"
              type="file"
              inputProps={{ accept: "image/*" }} // قبول ملفات الصور فقط
              onChange={handleFileChange}
            />
          </FormControl>
        </Grid>

        {/* زر التحديث */}
        <Grid item xs={12}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleSubmit(handleUpdate)}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : "تحديث"}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EditSocialLinks;