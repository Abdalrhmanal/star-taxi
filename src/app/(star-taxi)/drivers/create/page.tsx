"use client";
import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Box,
  CircularProgress,
  Autocomplete,
  Alert,
  Snackbar,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { UploadFile, Visibility, VisibilityOff } from "@mui/icons-material";
import useCreateData from "@/hooks/post-global";
import { useRouter } from "next/navigation";
import { useForm, Controller, FieldValues } from "react-hook-form";
import HeaderPageD from "@/components/header-page";
import Cookies from "js-cookie";

type User = {
  name: string;
  email: string;
  gender: "male" | "female" | null;
  phone_number: string;
  birthdate: string;
  password: string;
  password_confirmation: string;
  avatar?: File;
};

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB

const CreateDriver = () => {
  const router = useRouter();
  const token = Cookies.get("auth_user");

  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertSeverity, setAlertSeverity] = useState<"error" | "success">("success");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageError, setImageError] = useState("");

  const { control, handleSubmit, getValues, formState: { errors } } = useForm<User>({
    defaultValues: {
      name: "",
      email: "",
      gender: null,
      phone_number: "",
      birthdate: "",
      password: "",
      password_confirmation: "",
    },
  });

  const handleCreate = async (data: User) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value) formData.append(key, value as string);
    });
    if (selectedImage) formData.append("avatar", selectedImage);

    try {
      const response = await fetch("https://tawsella.online/api/drivers", {
        method: "POST",
        body: formData,
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (response.ok) {
        setAlertMessage("تمت إضافة السائق بنجاح!");
        setAlertSeverity("success");
        setOpenAlert(true);
        router.push("/drivers");
      } else {
        setAlertMessage(`خطأ: ${result.message || "حدث خطأ أثناء الإرسال"}`);
        setAlertSeverity("error");
        setOpenAlert(true);
      }
    } catch (error) {
      setAlertMessage("حدث خطأ أثناء الإرسال، يرجى المحاولة مرة أخرى.");
      setAlertSeverity("error");
      setOpenAlert(true);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      if (file.size > MAX_IMAGE_SIZE) {
        setImageError("يجب أن يكون حجم الصورة أقل من 10MB");
        setSelectedImage(null);
      } else {
        setImageError("");
        setSelectedImage(file);
      }
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 600, margin: "0 auto", padding: 3 }}>
      <HeaderPageD pluralName="السائقين" />

      <Snackbar open={openAlert} autoHideDuration={6000} onClose={() => setOpenAlert(false)}>
        <Alert onClose={() => setOpenAlert(false)} severity={alertSeverity} sx={{ width: "100%" }}>
          {alertMessage}
        </Alert>
      </Snackbar>

      <Typography variant="h4" gutterBottom sx={{ textAlign: "right" }}>
        إضافة مستخدم جديد
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Controller
            name="name"
            control={control}
            rules={{ required: "الاسم مطلوب" }}
            render={({ field }: { field: FieldValues }) => (
              <TextField
                fullWidth
                label="الاسم"
                variant="outlined"
                {...field}
                error={!!errors.name}
                helperText={errors.name ? errors.name.message : ""}
                sx={{ textAlign: "right" }}
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Controller
            name="email"
            control={control}
            rules={{
              required: "البريد الإلكتروني مطلوب",
              pattern: {
                value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "البريد الإلكتروني غير صحيح",
              },
            }}
            render={({ field }: { field: FieldValues }) => (
              <TextField
                fullWidth
                label="البريد الإلكتروني"
                variant="outlined"
                type="email"
                {...field}
                error={!!errors.email}
                helperText={errors.email ? errors.email.message : ""}
                sx={{ textAlign: "right" }}
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Controller
            name="gender"
            control={control}
            rules={{ required: "الرجاء اختيار الجنس" }}
            render={({ field }: { field: FieldValues }) => (
              <Autocomplete
                {...field}
                options={["male", "female"]}
                getOptionLabel={(option) => (option === "male" ? "ذكر" : "أنثى")}
                onChange={(_, value) => field.onChange(value)}
                value={field.value || ""}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="الجنس"
                    variant="outlined"
                    error={!!errors.gender}
                    helperText={errors.gender ? errors.gender.message : ""}
                    sx={{ textAlign: "right" }}
                  />
                )}
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Controller
            name="phone_number"
            control={control}
            rules={{
              required: "رقم الهاتف مطلوب",
              pattern: {
                value: /^(?:\+|00)[0-9]{10,}$/,
                message: "رقم الهاتف يجب أن يبدأ بـ + أو 00 ويكون لا يقل عن 12 رقمًا",
              },
            }}
            render={({ field }: { field: FieldValues }) => (
              <TextField
                fullWidth
                label="رقم الهاتف"
                variant="outlined"
                {...field}
                error={!!errors.phone_number}
                helperText={errors.phone_number ? errors.phone_number.message : ""}
                sx={{ textAlign: "right" }}
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Controller
            name="birthdate"
            control={control}
            rules={{ required: "تاريخ الميلاد مطلوب" }}
            render={({ field }: { field: FieldValues }) => (
              <TextField
                fullWidth
                label="تاريخ الميلاد"
                variant="outlined"
                type="date"
                InputLabelProps={{ shrink: true }}
                {...field}
                error={!!errors.birthdate}
                helperText={errors.birthdate ? errors.birthdate.message : ""}
                sx={{ textAlign: "right" }}
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Controller
            name="password"
            control={control}
            rules={{
              required: "كلمة المرور مطلوبة",
              minLength: { value: 6, message: "كلمة المرور يجب أن تحتوي على 6 أحرف على الأقل" },
            }}
            render={({ field }: { field: FieldValues }) => (
              <TextField
                fullWidth
                label="كلمة المرور"
                variant="outlined"
                type={showPassword ? "text" : "password"}
                {...field}
                error={!!errors.password}
                helperText={errors.password ? errors.password.message : ""}
                sx={{ textAlign: "right" }}
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
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="password_confirmation"
            control={control}
            rules={{
              required: "تأكيد كلمة المرور مطلوب",
              validate: (value) => value === getValues("password") || "كلمة المرور وتأكيد كلمة المرور غير متطابقين",
            }}
            render={({ field }: { field: FieldValues }) => (
              <TextField
                fullWidth
                label="تأكيد كلمة المرور"
                variant="outlined"
                type={showPasswordConfirmation ? "text" : "password"}
                {...field}
                error={!!errors.password_confirmation}
                helperText={errors.password_confirmation ? errors.password_confirmation.message : ""}
                sx={{ textAlign: "right" }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                        edge="end"
                      >
                        {showPasswordConfirmation ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1">صورة السائق</Typography>
          <Button
            variant="outlined"
            component="label"
            fullWidth
            startIcon={<UploadFile />}
          >
            تحميل صورة
            <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
          </Button>
          {selectedImage && <Typography variant="body2" sx={{ mt: 1 }}>{selectedImage.name}</Typography>}
          {imageError && <Alert severity="error" sx={{ mt: 1 }}>{imageError}</Alert>}
        </Grid>
        <Grid item xs={12}>
          <Button fullWidth variant="contained" color="primary" onClick={handleSubmit(handleCreate)} >
            إضافة
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CreateDriver;
