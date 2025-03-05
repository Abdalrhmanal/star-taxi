"use client";

import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  Autocomplete,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import useUpdateData from "@/hooks/put-global";
import useGlobalData from "@/hooks/get-global";

// تعريف نوع العرض
export type Offer = {
  movement_type_id: string;
  offer: string;
  value_of_discount: number;
  valid_date: string;
  description: string;
};

// تعريف نوع الحركة
export type MovementType = {
  id: string;
  type: string;
};

// تعريف نوع البيانات القادمة من API
interface GlobalDataType {
  data: {
    movementTypes: MovementType[];
  };
}

// مكون تعديل العرض
const EditOffer = ({ data, onSuccess }: { data: Offer & { id: string }; onSuccess?: () => void }) => {
  const { isLoading, isError, success, updateData } = useUpdateData<Offer>({
    dataSourceName: `api/offers/${data.id}`, // مسار API لتحديث العرض
  });

  const router = useRouter();
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<"error" | "success">("success");

  // جلب بيانات أنواع الحركات
  const { data: GlobalData, isLoading: GlobalLoading } = useGlobalData<GlobalDataType>({
    dataSourceName: "api/movement-types",
    enabled: true,
    setOldDataAsPlaceholder: true,
  });

  // حالة لتتبع الحركة المحددة
  const [selectedMovementType, setSelectedMovementType] = useState<MovementType | null>(null);

  const { control, handleSubmit, setValue, formState: { errors } } = useForm<Offer>({
    defaultValues: {
      movement_type_id: data.movement_type_id || "",
      offer: data.offer || "",
      value_of_discount: data.value_of_discount || 0,
      valid_date: data.valid_date || "",
      description: data.description || "",
    },
  });

  // تحميل البيانات في الفورم عند فتح الصفحة
  useEffect(() => {
    if (data) {
      setValue("movement_type_id", data.movement_type_id);
      setValue("offer", data.offer);
      setValue("value_of_discount", data.value_of_discount);
      setValue("valid_date", data.valid_date);
      setValue("description", data.description);

      // تعيين نوع الحركة المحدد مسبقًا بناءً على البيانات القادمة من API
      if (GlobalData?.data?.movementTypes) {
        const existingMovementType = GlobalData.data.movementTypes.find(mt => mt.id === data.movement_type_id);
        setSelectedMovementType(existingMovementType || null); // تعيين القيمة الافتراضية بناءً على البيانات
      }
    }
  }, [data, setValue, GlobalData]);

  // دالة معالجة التحديث
  const handleUpdate = async (formData: Offer) => {
    if (!formData.movement_type_id) {
      setAlertMessage("الرجاء اختيار نوع الحركة");
      setAlertSeverity("error");
      setOpenAlert(true);
      return;
    }
    if (!formData.offer) {
      setAlertMessage("العرض مطلوب");
      setAlertSeverity("error");
      setOpenAlert(true);
      return;
    }
    if (formData.value_of_discount <= 0) {
      setAlertMessage("قيمة الخصم يجب أن تكون أكبر من 0");
      setAlertSeverity("error");
      setOpenAlert(true);
      return;
    }
    if (!formData.valid_date) {
      setAlertMessage("تاريخ الصلاحية مطلوب");
      setAlertSeverity("error");
      setOpenAlert(true);
      return;
    }

    await updateData(formData);

    if (success) {
      setAlertMessage("تم تعديل العرض بنجاح!");
      setAlertSeverity("success");
      setOpenAlert(true);
      // if (onSuccess) onSuccess();
    } else if (isError) {
      setAlertMessage(`خطأ: ${isError}`);
      setAlertSeverity("error");
      setOpenAlert(true);
    }
  };

  useEffect(() => {
    if (success && onSuccess) {
      onSuccess();
    }
  }, [success, onSuccess]);

  return (
    <Box sx={{ width: "100%", maxWidth: 600, margin: "0 auto" }}>
      <Snackbar open={openAlert} autoHideDuration={6000} onClose={() => setOpenAlert(false)}>
        <Alert onClose={() => setOpenAlert(false)} severity={alertSeverity} sx={{ width: "100%" }}>
          {alertMessage}
        </Alert>
      </Snackbar>

      <Typography variant="h4" gutterBottom sx={{ textAlign: "right" }}>
        تعديل العرض
      </Typography>

      <Grid container spacing={2}>
        {/* اختيار نوع الحركة */}
        <Grid item xs={12}>
          <Controller
            name="movement_type_id"
            control={control}
            render={({ field }) => (
              <Autocomplete
                options={GlobalData?.data?.movementTypes || []}
                getOptionLabel={(option) => option.type}
                value={selectedMovementType}
                onChange={(_, value) => {
                  setSelectedMovementType(value);
                  setValue("movement_type_id", value ? value.id : "");
                }}
                isOptionEqualToValue={(option, value) => option.id === value?.id}
                loading={GlobalLoading}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="نوع الحركة"
                    variant="outlined"
                    error={!!errors.movement_type_id}
                    helperText={errors.movement_type_id ? "الرجاء اختيار نوع الحركة" : ""}
                    sx={{ textAlign: "right" }}
                  />
                )}
              />
            )}
          />
        </Grid>

        {/* إدخال العرض */}
        <Grid item xs={12}>
          <Controller
            name="offer"
            control={control}
            render={({ field }) => (
              <TextField
                fullWidth
                label="العرض"
                variant="outlined"
                {...field}
                error={!!errors.offer}
                helperText={errors.offer ? "العرض مطلوب" : ""}
                sx={{ textAlign: "right" }}
              />
            )}
          />
        </Grid>

        {/* إدخال قيمة الخصم */}
        <Grid item xs={12}>
          <Controller
            name="value_of_discount"
            control={control}
            render={({ field }) => (
              <TextField
                fullWidth
                label="قيمة الخصم"
                variant="outlined"
                type="number"
                {...field}
                error={!!errors.value_of_discount}
                helperText={errors.value_of_discount ? "قيمة الخصم يجب أن تكون أكبر من 0" : ""}
                sx={{ textAlign: "right" }}
              />
            )}
          />
        </Grid>

        {/* إدخال تاريخ الصلاحية */}
        <Grid item xs={12}>
          <Controller
            name="valid_date"
            control={control}
            render={({ field }) => (
              <TextField
                fullWidth
                label="تاريخ الصلاحية"
                variant="outlined"
                type="date"
                InputLabelProps={{ shrink: true }}
                {...field}
                error={!!errors.valid_date}
                helperText={errors.valid_date ? "تاريخ الصلاحية مطلوب" : ""}
                sx={{ textAlign: "right" }}
              />
            )}
          />
        </Grid>

        {/* إدخال الوصف */}
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

export default EditOffer;
