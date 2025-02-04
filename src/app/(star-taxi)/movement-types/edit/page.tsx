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
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import useUpdateData from "@/hooks/put-global";

// تعريف نوع البيانات
type Movement = {
    type: string;
    price: number;
    description: string;
    is_onKM: boolean;
    payment: string;
    is_general: boolean;
};

// دالة التحقق من القيم:
const validateType = (type: string) => (!type ? "نوع الحركة مطلوب" : "");
const validatePrice = (price: number) => (price <= 0 ? "السعر يجب أن يكون أكبر من 0" : "");
const validatePayment = (payment: string) => (!payment ? "طريقة الدفع مطلوبة" : "");

const EditMovementType = ({ data }: { data: Movement & { id: string } }) => {
    const { isLoading, isError, success, updateData } = useUpdateData<Movement>({
        dataSourceName: `api/movement-types/${data.id}`,
    });

    const router = useRouter();
    const [openAlert, setOpenAlert] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string>("");
    const [alertSeverity, setAlertSeverity] = useState<"error" | "success">("success");

    // تهيئة النموذج باستخدام القيم الافتراضية من البيانات
    const { control, handleSubmit, setValue, formState: { errors } } = useForm<Movement>({
        defaultValues: {
            type: data.type || "",
            price: data.price || 0,
            description: data.description || "",
            is_onKM: data.is_onKM || false,
            payment: data.payment || "TL",
            is_general: data.is_general || false,
        },
    });

    // تحميل البيانات في النموذج عند فتح الصفحة
    useEffect(() => {
        if (data) {
            setValue("type", data.type);
            setValue("price", data.price);
            setValue("description", data.description);
            setValue("is_onKM", data.is_onKM);
            setValue("payment", data.payment);
            setValue("is_general", data.is_general);
        }
    }, [data, setValue]);

    // دالة معالجة التحديث
    const handleUpdate = async (formData: Movement) => {
        // تحقق من الحقول قبل الإرسال
        const typeError = validateType(formData.type);
        const priceError = validatePrice(formData.price);
        const paymentError = validatePayment(formData.payment);

        if (typeError || priceError || paymentError) {
            setAlertMessage("الرجاء تعبئة جميع الحقول المطلوبة");
            setAlertSeverity("error");
            setOpenAlert(true);
            return;
        }

        await updateData(formData);

        if (success) {
            setAlertMessage("تم تعديل البيانات بنجاح!");
            setAlertSeverity("success");
            setOpenAlert(true);
            router.back();
        } else if (isError) {
            setAlertMessage(`خطأ: ${isError}`);
            setAlertSeverity("error");
            setOpenAlert(true);
        }
    };

    return (
        <Box sx={{ width: "100%", maxWidth: 600, margin: "0 auto", }}>
            {/* التنبيه أعلى الصفحة */}
            <Snackbar open={openAlert} autoHideDuration={6000} onClose={() => setOpenAlert(false)}>
                <Alert onClose={() => setOpenAlert(false)} severity={alertSeverity} sx={{ width: "100%" }}>
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

                {/* السعر */}
                <Grid item xs={12}>
                    <Controller
                        name="price"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                fullWidth
                                label="السعر"
                                variant="outlined"
                                type="number"
                                {...field}
                                error={!!errors.price}
                                helperText={errors.price ? errors.price.message : ""}
                                sx={{ textAlign: "right" }}
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
                                control={<Switch checked={field.value} onChange={field.onChange} />}
                                label="الحساب بالكيلومتر"
                            />
                        )}
                    />
                </Grid>

                {/* طريقة الدفع */}
                <Grid item xs={12}>
                    <Controller
                        name="payment"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                fullWidth
                                label="طريقة الدفع"
                                variant="outlined"
                                {...field}
                                error={!!errors.payment}
                                helperText={errors.payment ? errors.payment.message : ""}
                                sx={{ textAlign: "right" }}
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
                                control={<Switch checked={field.value} onChange={field.onChange} />}
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
                        {isLoading ? <CircularProgress size={24} color="inherit" /> : "تحديث"}
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default EditMovementType;
