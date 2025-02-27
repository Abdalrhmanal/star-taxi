"use client";
import React, { useState } from "react";
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
import useCreateData from "@/hooks/post-global";
import { useRouter } from "next/navigation";
import { useForm, Controller, FieldValues } from "react-hook-form";
import HeaderPageD from "@/components/header-page";

// تعريف نوع البيانات
type Movement = {
    type: string;
    price: number;
    description: string;
    is_onKM: boolean;
    payment: string;
    is_general: boolean;
};

const CreateMovementType = () => {
    const { isLoading, isError, success, createData } = useCreateData<Movement>({
        dataSourceName: "api/movement-types",
    });

    const router = useRouter();
    const [openAlert, setOpenAlert] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string>("");
    const [alertSeverity, setAlertSeverity] = useState<"error" | "success">("success");

    const { control, handleSubmit, setValue, formState: { errors } } = useForm<Movement>({
        defaultValues: {
            type: "",
            price: 0,
            description: "",
            is_onKM: false,
            payment: "TL",
            is_general: false,
        },
    });

    const handleCreate = async (data: Movement) => {
        await createData(data);

        if (success) {
            setAlertMessage("تمت الإضافة بنجاح!");
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
        <Box sx={{ width: "100%", maxWidth: 600, margin: "0 auto", padding: 3 }}>
            <HeaderPageD pluralName="الرحلات"/>
            {/* التنبيه أعلى الصفحة */}
            <Snackbar open={openAlert} autoHideDuration={6000} onClose={() => setOpenAlert(false)}>
                <Alert onClose={() => setOpenAlert(false)} severity={alertSeverity} sx={{ width: "100%" }}>
                    {alertMessage}
                </Alert>
            </Snackbar>

            <Typography variant="h4" gutterBottom sx={{ textAlign: "right" }}>
                إضافة نوع حركة جديد
            </Typography>

            <Grid container spacing={2}>
                {/* نوع الحركة */}
                <Grid item xs={12}>
                    <Controller
                        name="type"
                        control={control}
                        rules={{ required: "نوع الحركة مطلوب" }}
                        render={({ field }: { field: FieldValues }) => (
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
                        rules={{
                            required: "السعر مطلوب",
                            min: { value: 1, message: "السعر يجب أن يكون أكبر من 0" },
                        }}
                        render={({ field }: { field: FieldValues }) => (
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
                        render={({ field }: { field: FieldValues }) => (
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
                        render={({ field }: { field: FieldValues }) => (
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
                        rules={{ required: "طريقة الدفع مطلوبة" }}
                        render={({ field }: { field: FieldValues }) => (
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
                        render={({ field }: { field: FieldValues }) => (
                            <FormControlLabel
                                control={<Switch checked={field.value} onChange={field.onChange} />}
                                label="عام"
                            />
                        )}
                    />
                </Grid>

                {/* زر الإضافة */}
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

export default CreateMovementType;