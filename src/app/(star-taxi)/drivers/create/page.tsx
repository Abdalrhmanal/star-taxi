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
import { Visibility, VisibilityOff } from "@mui/icons-material";
import useCreateData from "@/hooks/post-global";
import { useRouter } from "next/navigation";
import { useForm, Controller, FieldValues } from "react-hook-form";
import HeaderPageD from "@/components/header-page";

type User = {
  name: string;
  email: string;
  gender: "male" | "female" | null;
  phone_number: string;
  birth_date: Date;
  password: string;
  password_confirmation: string;
};

// دوال التحقق من القيم:
const validateName = (name: string) => {
  if (!name) return "الاسم مطلوب";
  return "";
};

const validateEmail = (email: string) => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!email) return "البريد الإلكتروني مطلوب";
  if (!emailRegex.test(email)) return "البريد الإلكتروني غير صحيح";
  return "";
};

const validateGender = (gender: "male" | "female" | null) => {
  if (!gender) return "الرجاء اختيار الجنس";
  return "";
};

const validatePhoneNumber = (phone_number: string) => {
  if (!phone_number) return "رقم الهاتف مطلوب";
  return "";
};

const validateBirthDate = (birth_date: Date) => {
  if (!birth_date) return "تاريخ الميلاد مطلوب";
  return "";
};

const validatePassword = (password: string) => {
  if (!password) return "كلمة المرور مطلوبة";
  if (password.length < 6) return "كلمة المرور يجب أن تحتوي على 6 أحرف على الأقل";
  return "";
};

const validatePasswordConfirmation = (password_confirmation: string, password: string) => {
  if (!password_confirmation) return "تأكيد كلمة المرور مطلوب";
  if (password_confirmation !== password) return "كلمة المرور وتأكيد كلمة المرور غير متطابقين";
  return "";
};

const CreateDriver = () => {
  const { isLoading, isError, success, createData } = useCreateData<User>({
    dataSourceName: "api/drivers",
  });

  const router = useRouter();
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertSeverity, setAlertSeverity] = useState<"error" | "success">("success");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState<boolean>(false);

  const { control, handleSubmit, setValue, formState: { errors } } = useForm<User>({
    defaultValues: {
      name: "",
      email: "",
      gender: null,
      phone_number: "",
      birth_date: new Date(),
      password: "",
      password_confirmation: "",
    },
  });

  const handleCreate = async (data: User) => {
    // تحقق من الحقول قبل الإرسال
    const nameError = validateName(data.name);
    const emailError = validateEmail(data.email);
    const genderError = validateGender(data.gender);
    const phoneError = validatePhoneNumber(data.phone_number);
    const birthDateError = validateBirthDate(data.birth_date);
    const passwordError = validatePassword(data.password);
    const passwordConfirmationError = validatePasswordConfirmation(data.password_confirmation, data.password);

    // إذا كان هناك أخطاء، نعرضها ولن نرسل البيانات
    if (nameError || emailError || genderError || phoneError || birthDateError || passwordError || passwordConfirmationError) {
      setValue('name', data.name);
      setValue('email', data.email);
      setValue('gender', data.gender);
      setValue('phone_number', data.phone_number);
      setValue('birth_date', data.birth_date);
      setValue('password', data.password);
      setValue('password_confirmation', data.password_confirmation);
      return;
    }

    await createData({
      name: data.name,
      email: data.email,
      gender: data.gender,
      phone_number: data.phone_number,
      birth_date: data.birth_date,
      password: data.password,
      password_confirmation: data.password_confirmation,
    });
  };

  useEffect(() => {
    if (success) {
      setAlertMessage("تمت الإضافة بنجاح!");
      setAlertSeverity("success");
      setOpenAlert(true);
      router.push('/drivers');
    } else if (isError) {
      setAlertMessage(`خطأ: ${isError}`);
      setAlertSeverity("error");
      setOpenAlert(true);
    }
  }, [success, isError, router]);

  return (
    <Box sx={{ width: "100%", maxWidth: 600, margin: "0 auto", padding: 3 }}>
      <HeaderPageD pluralName="السائقين"/>
      {/* التنبيه أعلى الصفحة */}
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
            render={({ field }: { field: FieldValues }) => (
              <Autocomplete
                {...field}
                options={["male", "female"]}
                getOptionLabel={(option) => option === "male" ? "ذكر" : "أنثى"}
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
            name="birth_date"
            control={control}
            render={({ field }: { field: FieldValues }) => (
              <TextField
                fullWidth
                label="تاريخ الميلاد"
                variant="outlined"
                type="date"
                InputLabelProps={{ shrink: true }}
                {...field}
                error={!!errors.birth_date}
                helperText={errors.birth_date ? errors.birth_date.message : ""}
                sx={{ textAlign: "right" }}
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Controller
            name="password"
            control={control}
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
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
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

export default CreateDriver;