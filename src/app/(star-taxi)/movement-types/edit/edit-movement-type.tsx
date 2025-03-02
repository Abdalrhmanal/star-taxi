"use client";

import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  Switch,
  FormControlLabel,
  Autocomplete,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import useUpdateData from "@/hooks/put-global";

// تعريف نوع البيانات
export type Movement = {
  id: string;
  type: string;
  price1: number;
  price2: number;
  description: string;
  is_onKM: boolean;
  payment1: string;
  payment2: string;
  is_general: boolean;
};

const EditMovementType = ({ data, onSuccess }: { data: Movement; onSuccess?: () => void; }) => {
  const { isLoading, isError, success, updateData } =
    useUpdateData<Movement>({
      dataSourceName: `api/movement-types/${data.id}`,
    });
  const router = useRouter();
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertSeverity, setAlertSeverity] = useState<"error" | "success">(
    "success"
  );

  // تهيئة النموذج باستخدام القيم الافتراضية من البيانات
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Movement>({
    defaultValues: {
      type: data.type || "",
      price1: data.price1 || 0,
      payment1: data.payment1 || "TL",
      price2: data.price2 || 0,
      payment2: data.payment2 || "TL",
      description: data.description || "",
      is_onKM: data.is_onKM || false,
      is_general: data.is_general || false,
      id: data.id,
    },
  });

  // تحميل البيانات في النموذج عند فتح الصفحة
  useEffect(() => {
    if (data) {
      setValue("type", data.type);
      setValue("price1", data.price1);
      setValue("payment1", data.payment1);
      setValue("price2", data.price2);
      setValue("payment2", data.payment2);
      setValue("description", data.description);
      setValue("is_onKM", data.is_onKM);
      setValue("is_general", data.is_general);
    }
  }, [data, setValue]);

  // دالة معالجة التحديث
  const handleUpdate = async (formData: Movement) => {
    await updateData(formData);

    if (success) {
      setAlertMessage("تم تعديل البيانات بنجاح!");
      setAlertSeverity("success");
      setOpenAlert(true);
      if (onSuccess) onSuccess();
    } else if (isError) {
      setAlertMessage(`خطأ: ${isError}`);
      setAlertSeverity("error");
      setOpenAlert(true);
    }
  };

  const paymentOptions = ["TL", "USD", "SYP"];

  return (
    <Box sx={{ width: "100%", maxWidth: 600, margin: "0 auto" }}>
      {/* التنبيه أعلى الصفحة */}
      <Snackbar
        open={openAlert}
        autoHideDuration={6000}
        onClose={() => setOpenAlert(false)}
      >
        <Alert
          onClose={() => setOpenAlert(false)}
          severity={alertSeverity}
          sx={{ width: "100%" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>

      <Typography variant="h4" gutterBottom sx={{ textAlign: "right" }}>
        تعديل نوع الحركة
      </Typography>

      <Grid container spacing={2}>
        {/* نوع الحركة */}
        <Grid item xs={12}>
          <Controller
            name="type"
            control={control}
            rules={{ required: "نوع الحركة مطلوب" }}
            render={({ field }) => (
              <TextField
                fullWidth
                label="نوع الحركة"
                variant="outlined"
                {...field}
                error={!!errors.type}
                helperText={errors.type ? errors.type.message : ""}
                sx={{ textAlign: "right" }}
              />
            )}
          />
        </Grid>

        {/* السعر الأول */}
        <Grid item xs={12}>
          <Controller
            name="price1"
            control={control}
            rules={{
              required: "السعر مطلوب",
              min: { value: 1, message: "السعر يجب أن يكون أكبر من 0" },
            }}
            render={({ field }) => (
              <TextField
                fullWidth
                label="السعر الأول"
                variant="outlined"
                type="number"
                {...field}
                error={!!errors.price1}
                helperText={errors.price1 ? errors.price1.message : ""}
                sx={{ textAlign: "right" }}
              />
            )}
          />
        </Grid>

        {/* طريقة الدفع الأولى */}
        <Grid item xs={12}>
          <Controller
            name="payment1"
            control={control}
            rules={{ required: "طريقة الدفع مطلوبة" }}
            render={({ field }) => (
              <Autocomplete
                options={paymentOptions}
                getOptionLabel={(option) => option}
                onChange={(_, value) => field.onChange(value ?? "TL")}
                value={field.value ?? "TL"} // Ensure it's not null
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    label="طريقة الدفع الأولى"
                    variant="outlined"
                    error={!!errors.payment1}
                    helperText={errors.payment1 ? errors.payment1.message : ""}
                  />
                )}
              />
            )}
          />

        </Grid>

        {/* السعر الثاني */}
        <Grid item xs={12}>
          <Controller
            name="price2"
            control={control}
            rules={{
              required: "السعر مطلوب",
              min: { value: 1, message: "السعر يجب أن يكون أكبر من 0" },
            }}
            render={({ field }) => (
              <TextField
                fullWidth
                label="السعر الثاني"
                variant="outlined"
                type="number"
                {...field}
                error={!!errors.price2}
                helperText={errors.price2 ? errors.price2.message : ""}
                sx={{ textAlign: "right" }}
              />
            )}
          />
        </Grid>

        {/* طريقة الدفع الثانية */}
        <Grid item xs={12}>
          <Controller
            name="payment2"
            control={control}
            rules={{ required: "طريقة الدفع مطلوبة" }}
            render={({ field }) => (
              <Autocomplete
                options={paymentOptions}
                getOptionLabel={(option) => option}
                onChange={(_, value) => field.onChange(value ?? "LT")}
                value={field.value ?? "LT"}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    label="طريقة الدفع الثانية"
                    variant="outlined"
                    error={!!errors.payment2}
                    helperText={errors.payment2 ? errors.payment2.message : ""}
                    sx={{ textAlign: "right" }}
                  />
                )}
              />
            )}
          />
        </Grid>

        {/* الوصف */}
        <Grid item xs={12}>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                fullWidth
                label="الوصف"
                variant="outlined"
                {...field}
                sx={{ textAlign: "right" }}
              />
            )}
          />
        </Grid>

        {/* تحديد الحساب بالكيلومتر */}
        <Grid item xs={12}>
          <Controller
            name="is_onKM"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Switch
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                }
                label="الحساب بالكيلومتر"
              />
            )}
          />
        </Grid>

        {/* نوع الحركة (عام أو خاص) */}
        <Grid item xs={12}>
          <Controller
            name="is_general"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Switch
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                }
                label="عام"
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
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "تحديث"
            )}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EditMovementType;