"use client";
import useUpdateData from "@/hooks/put-global";
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
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";

type User = {
  id: string;
  name: string;
  email: string;
  gender: "male" | "female" | null;
  phone_number: string;
  birth_date: Date;
  password?: string;
  password_confirmation?: string;
};

const EditDriver = ({ data, onSuccess }: { data: any; onSuccess?: () => void | undefined;}) => {
  console.log(data);
  
  const { control, handleSubmit, formState: { errors }, setValue, getValues } = useForm<User>({
    defaultValues: {
      id: "",
      name: "",
      email: "",
      gender: null,
      phone_number: "",
      password: "",
      password_confirmation: "",
    },
  });

  // محاكاة تحميل البيانات (يمكنك استبدال هذا بـ API أو بيانات حقيقية)
  useEffect(() => {
    if (data) {
      setValue('id', data.driver_id);
      setValue('name', data.name);
      setValue('email', data.email);
      setValue('gender', data.gender === 0 ? "male" : "female");
      setValue('phone_number', data.phone_number);
    }
  }, [data, setValue]);

  const { isLoading, isError, success, updateData } = useUpdateData<User>({
    dataSourceName: `api/drivers/${data.driver_id}`, // مسار API لتحديث المستخدم
  });

  useEffect(() => {
    if (success && onSuccess) {
      onSuccess();
    }
  }, [success, onSuccess]);

  const handleUpdate = async (updatedData: User) => {
    await updateData(updatedData);
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 600, margin: "0 auto", }}>
      {/* عرض التنبيه للنجاح أو الخطأ في رأس الصفحة */}
      {isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          خطأ: {isError}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          تم التعديل بنجاح!
        </Alert>
      )}

      <Typography variant="h4" gutterBottom sx={{ textAlign: "right" }}>
        تعديل المستخدم
      </Typography>

      <Grid container spacing={2}>
        {/* حقل الاسم */}
        <Grid item xs={12}>
          <Controller
            name="name"
            control={control}
            rules={{ required: "الاسم مطلوب" }}
            render={({ field }) => (
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

        {/* حقل البريد الإلكتروني */}
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

        {/* حقل الجنس */}
        <Grid item xs={12}>
          <Controller
            name="gender"
            control={control}
            rules={{ required: "الرجاء اختيار الجنس" }}
            render={({ field }) => (
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

        {/* حقل رقم الهاتف */}
        <Grid item xs={12}>
          <Controller
            name="phone_number"
            control={control}
            rules={{ required: "رقم الهاتف مطلوب" }}
            render={({ field }) => (
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

        {/* حقل كلمة المرور */}
        <Grid item xs={12}>
          <Controller
            name="password"
            control={control}
            // rules={{ required: "كلمة المرور مطلوبة" }}
            render={({ field }) => (
              <TextField
                fullWidth
                label="كلمة المرور"
                variant="outlined"
                type="password"
                {...field}
                error={!!errors.password}
                helperText={errors.password ? errors.password.message : ""}
                sx={{ textAlign: "right" }}
              />
            )}
          />
        </Grid>

        {/* حقل تأكيد كلمة المرور */}
        <Grid item xs={12}>
          <Controller
            name="password_confirmation"
            control={control}
           // rules={{
           //   required: "تأكيد كلمة المرور مطلوب",
           //   validate: (value) => value === getValues("password") || "كلمة المرور وتأكيد كلمة المرور غير متطابقين",
           // }}
            render={({ field }) => (
              <TextField
                fullWidth
                label="تأكيد كلمة المرور"
                variant="outlined"
                type="password"
                {...field}
                error={!!errors.password_confirmation}
                helperText={errors.password_confirmation ? errors.password_confirmation.message : ""}
                sx={{ textAlign: "right" }}
              />
            )}
          />
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

export default EditDriver;