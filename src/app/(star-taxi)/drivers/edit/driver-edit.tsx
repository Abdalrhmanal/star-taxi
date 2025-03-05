"use client";
import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  CircularProgress,
  Box,
  Autocomplete,
  Alert,
  Avatar,
} from "@mui/material";
import { useForm, Controller, FieldValues } from "react-hook-form";
import Cookies from "js-cookie";

type User = {
  id: string;
  name: string;
  email: string;
  gender: "male" | "female" | null;
  phone_number: string;
  password?: string;
  password_confirmation?: string;
  birthdate?: string;
  avatar?: string;
};

const EditDriver = ({ data, onSuccess }: { data: any; onSuccess?: () => void }) => {
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertSeverity, setAlertSeverity] = useState<"success" | "error" | undefined>(undefined);

  const token = Cookies.get("auth_user");

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    watch,
  } = useForm<User>({
    defaultValues: {
      id: "",
      name: "",
      email: "",
      gender: null,
      phone_number: "",
      password: "",
      password_confirmation: "",
      birthdate: "",
      avatar: "",
    },
  });

  useEffect(() => {
    if (data) {
      setValue("id", data.driver_id);
      setValue("name", data.name);
      setValue("email", data.email);
      setValue("gender", data.gender);
      setValue("phone_number", data.phone_number);
      setValue("birthdate", data.birthdate);
      setValue("avatar", data.avatar);
    }
  }, [data, setValue]);

  const handleUpdate = async (updatedData: User) => {
    setIsLoading(true);

    if (!showPasswordFields) {
      delete updatedData.password;
      delete updatedData.password_confirmation;
    }

    const formData = new FormData();
    formData.append("name", updatedData.name);
    formData.append("email", updatedData.email);
    formData.append("gender", updatedData.gender || "");
    formData.append("phone_number", updatedData.phone_number);
    formData.append("birthdate", updatedData.birthdate || "");
    if (updatedData.password) formData.append("password", updatedData.password);
    if (updatedData.password_confirmation) formData.append("password_confirmation", updatedData.password_confirmation);
    if (avatar) formData.append("avatar", avatar);

    try {
      const response = await fetch(`https://tawsella.online/api/drivers/${data.driver_id}`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (response.ok) {
        setAlertMessage("تم تعديل السائق بنجاح!");
        setAlertSeverity("success");
        if (onSuccess) onSuccess();
      } else {
        setAlertMessage(`خطأ: ${result.message || "حدث خطأ أثناء الإرسال"}`);
        setAlertSeverity("error");
      }
    } catch (error) {
      setAlertMessage("حدث خطأ أثناء الإرسال، يرجى المحاولة مرة أخرى.");
      setAlertSeverity("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file && file.size <= 10 * 1024 * 1024) {
      setAvatar(file);
    } else {
      alert("حجم الصورة يجب أن لا يتجاوز 10 ميجابايت.");
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 600, margin: "0 auto" }}>
      {alertMessage && <Alert severity={alertSeverity} sx={{ mb: 2 }}>{alertMessage}</Alert>}

      <Typography variant="h4" gutterBottom sx={{ textAlign: "right" }}>تعديل المستخدم</Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Avatar src={avatar ? URL.createObjectURL(avatar) : `https://tawsella.online/${data.avatar}`} sx={{ width: 100, height: 100 }} />
          <Button variant="outlined" component="label">
            اختيار صورة
            <input type="file" hidden accept="image/*" onChange={handleAvatarChange} />
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="name"
            control={control}
            rules={{ required: "الاسم مطلوب" }}
            render={({ field }) => (
              <TextField fullWidth label="الاسم" variant="outlined" {...field} error={!!errors.name} helperText={errors.name?.message || ""} />
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
            render={({ field }) => (
              <TextField fullWidth label="البريد الإلكتروني" variant="outlined" type="email" {...field} error={!!errors.email} helperText={errors.email?.message || ""} />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Controller
            name="gender"
            control={control}
            rules={{ required: "الرجاء اختيار الجنس" }}
            render={({ field }) => (
              <Autocomplete
                options={["male", "female"]}
                getOptionLabel={(option) => (option === "male" ? "ذكر" : "أنثى")}
                isOptionEqualToValue={(option, value) => option === value}
                onChange={(_, value) => field.onChange(value)}
                value={field.value} // تعيين القيمة الافتراضية هنا
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="الجنس"
                    variant="outlined"
                    error={!!errors.gender}
                    helperText={errors.gender?.message || ""}
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
            render={({ field }) => (
              <TextField fullWidth label="رقم الهاتف" variant="outlined" {...field} error={!!errors.phone_number} helperText={errors.phone_number?.message || ""} />
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
                value={field.value} // تعيين القيمة الافتراضية هنا
                error={!!errors.birthdate}
                helperText={errors.birthdate ? errors.birthdate.message : ""}
                sx={{ textAlign: "right" }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Button fullWidth variant="outlined" onClick={() => setShowPasswordFields(!showPasswordFields)}>
            {showPasswordFields ? "إخفاء حقل تغيير كلمة المرور" : "تغيير كلمة المرور"}
          </Button>
        </Grid>

        {showPasswordFields && (
          <>
            <Grid item xs={12}>
              <Controller
                name="password"
                control={control}
                rules={{ minLength: { value: 8, message: "كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل" } }}
                render={({ field }) => (
                  <TextField fullWidth label="كلمة المرور" variant="outlined" type="password" {...field} error={!!errors.password} helperText={errors.password?.message || ""} />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="password_confirmation"
                control={control}
                rules={{ validate: (value) => value === getValues("password") || "كلمة المرور وتأكيد كلمة المرور غير متطابقين" }}
                render={({ field }) => (
                  <TextField fullWidth label="تأكيد كلمة المرور" variant="outlined" type="password" {...field} error={!!errors.password_confirmation} helperText={errors.password_confirmation?.message || ""} />
                )}
              />
            </Grid>
          </>
        )}

        <Grid item xs={12}>
          <Button fullWidth variant="contained" color="primary" onClick={handleSubmit(handleUpdate)} disabled={isLoading}>
            {isLoading ? <CircularProgress size={24} color="inherit" /> : "تحديث"}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EditDriver;
