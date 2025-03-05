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
    Autocomplete,
} from "@mui/material";
import useCreateData from "@/hooks/post-global";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import HeaderPageD from "@/components/header-page";

// تعريف نوع البيانات
type Movement = {
    type: string;
    price1: number;
    payment1: string;
    price2: number;
    payment2: string;
    description: string;
    is_onKM: boolean;
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

    const { control, handleSubmit, formState: { errors } } = useForm<Movement>({
        defaultValues: {
            type: "",
            price1: 0,
            payment1: "TL",
            price2: 0,
            payment2: "TL",
            description: "",
            is_onKM: false,
            is_general: false,
        },
    });

    const handleCreate = async (data: Movement) => {
        const formattedData = {
            type: data.type,
            price1: data.price1,
            payment1: data.payment1,
            price2: data.price2,
            payment2: data.payment2,
            description: data.description,
            is_onKM: data.is_onKM,
            is_general: data.is_general,
        };

        await createData(formattedData);

        if (success) {
            setAlertMessage("تمت الإضافة بنجاح!");
            setAlertSeverity("success");
            setOpenAlert(true);
            router.push('/movement-types/m-inside');
        } else if (isError) {
            setAlertMessage(`خطأ: ${isError}`);
            setAlertSeverity("error");
            setOpenAlert(true);
        }
    };

    const paymentOptions = [
        { label: "TL - تركي", value: "TL" },
        { label: "USD - دولار", value: "USD" },
        { label: "SYP - سوري", value: "SYP" },
    ];

    return (
        <Box sx={{ width: "100%", maxWidth: 600, margin: "0 auto", padding: 3 }}>
            <HeaderPageD pluralName="الرحلات" />

            <Snackbar open={openAlert} autoHideDuration={6000} onClose={() => setOpenAlert(false)}>
                <Alert onClose={() => setOpenAlert(false)} severity={alertSeverity} sx={{ width: "100%" }}>
                    {alertMessage}
                </Alert>
            </Snackbar>

            <Typography variant="h4" gutterBottom sx={{ textAlign: "right" }}>
                إضافة نوع حركة جديد
            </Typography>

            <Grid container spacing={2}>
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
                            />
                        )}
                    />
                </Grid>

                {/* السعر الأول وطريقة الدفع */}
                <Grid item xs={6}>
                    <Controller
                        name="price1"
                        control={control}
                        rules={{ required: "السعر مطلوب", min: { value: 0, message: "يجب أن يكون السعر 0 أو أكبر" } }}
                        render={({ field }) => (
                            <TextField
                                fullWidth
                                label="السعر الأول"
                                variant="outlined"
                                type="number"
                                {...field}
                                error={!!errors.price1}
                                helperText={errors.price1 ? errors.price1.message : ""}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={6}>
                    <Controller
                        name="payment1"
                        control={control}
                        rules={{ required: "طريقة الدفع مطلوبة" }}
                        render={({ field }) => (
                            <Autocomplete
                                options={paymentOptions}
                                getOptionLabel={(option) => option.label}
                                onChange={(_, value) => field.onChange(value?.value ?? "TL")}
                                value={paymentOptions.find(option => option.value === field.value) || null}
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

                {/* السعر الثاني وطريقة الدفع */}
                <Grid item xs={6}>
                    <Controller
                        name="price2"
                        control={control}
                        rules={{ required: "السعر مطلوب", min: { value: 0, message: "يجب أن يكون السعر 0 أو أكبر" } }}
                        render={({ field }) => (
                            <TextField
                                fullWidth
                                label="السعر الثاني"
                                variant="outlined"
                                type="number"
                                {...field}
                                error={!!errors.price2}
                                helperText={errors.price2 ? errors.price2.message : ""}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={6}>
                    <Controller
                        name="payment2"
                        control={control}
                        rules={{ required: "طريقة الدفع مطلوبة" }}
                        render={({ field }) => (
                            <Autocomplete
                                options={paymentOptions}
                                getOptionLabel={(option) => option.label}
                                onChange={(_, value) => field.onChange(value?.value ?? "TL")}
                                value={paymentOptions.find(option => option.value === field.value) || null}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        fullWidth
                                        label="طريقة الدفع الثانية"
                                        variant="outlined"
                                        error={!!errors.payment2}
                                        helperText={errors.payment2 ? errors.payment2.message : ""}
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
                            />
                        )}
                    />
                </Grid>

                {/* 
                <Grid item xs={12}>
                    <Controller
                        name="is_onKM"
                        control={control}
                        render={({ field }) => (
                            <FormControlLabel control={<Switch checked={field.value} onChange={field.onChange} />} label="الحساب بالكيلومتر" />
                        )}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Controller
                        name="is_general"
                        control={control}
                        render={({ field }) => (
                            <FormControlLabel control={<Switch checked={field.value} onChange={field.onChange} />} label="عام" />
                        )}
                    />
                </Grid>
                 */}

                {/* زر الإضافة */}
                <Grid item xs={12}>
                    <Button fullWidth variant="contained" color="primary" onClick={handleSubmit(handleCreate)} disabled={isLoading}>
                        {isLoading ? <CircularProgress size={24} color="inherit" /> : "إضافة"}
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default CreateMovementType;
