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
  Avatar,
} from "@mui/material";
import { useForm, Controller, FieldValues } from "react-hook-form";

type User = {
  id: string;
  name: string;
  email: string;
  gender: "male" | "female" | null;
  phone_number: string;
  password?: string;
  password_confirmation?: string;
  birthdate?: string;
  avatar?: string; // إضافة الصورة الشخصية كجزء من النموذج
};

const EditDriver = ({ data, onSuccess }: { data: any; onSuccess?: () => void }) => {
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [image, setImage] = useState<File | null>(null); // حالة لتخزين الصورة الجديدة

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
      avatar: "", // إضافة قيمة افتراضية للصورة
    },
  });

  useEffect(() => {
    if (data) {
      setValue("id", data.driver_id);
      setValue("name", data.name);
      setValue("email", data.email);
      setValue("gender", data.gender); // تعيين القيمة الافتراضية للجنس
      setValue("phone_number", data.phone_number);
      setValue("birthdate", data.birthdate); // تعيين القيمة الافتراضية لتاريخ الميلاد
      setValue("avatar", data.avatar); // إضافة الصورة الحالية في الuseEffect
    }
  }, [data, setValue]);
  console.log(data);

  const { isLoading, isError, success, updateData } = useUpdateData<User>({
    dataSourceName: `api/drivers/${data.driver_id}`,
  });

  useEffect(() => {
    if (success && onSuccess) {
      onSuccess();
    }
  }, [success, onSuccess]);

  const handleUpdate = async (updatedData: User) => {
    if (!showPasswordFields) {
      delete updatedData.password;
      delete updatedData.password_confirmation;
    }
    if (image) {
      updatedData.avatar = URL.createObjectURL(image); // تعيين الصورة الجديدة في البيانات
    }
    await updateData(updatedData);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      if (file.size <= 10 * 1024 * 1024) { // تحقق من حجم الصورة (10 ميجابايت)
        setImage(file);
      } else {
        alert("حجم الصورة يجب أن لا يتجاوز 10 ميجابايت.");
      }
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 600, margin: "0 auto" }}>
      {isError && <Alert severity="error" sx={{ mb: 2 }}>خطأ: {isError}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>تم التعديل بنجاح!</Alert>}

      <Typography variant="h4" gutterBottom sx={{ textAlign: "right" }}>تعديل المستخدم</Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Avatar src={image ? URL.createObjectURL(image) : `https://tawsella.online/${data.avatar}`} sx={{ width: 100, height: 100 }} />
          <Button variant="outlined" color="primary" component="label">
            اختيار صورة
            <input type="file" hidden accept="image/*" onChange={handleImageChange} />
          </Button>
          <Button variant="outlined" color="error">
            حذف الصورة
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
