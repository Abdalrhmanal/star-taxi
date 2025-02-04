"use client";
import React, { useState, useEffect } from "react";
import {
    TextField,
    Button,
    Grid,
    Typography,
    Box,
    CircularProgress,
    Alert,
    Snackbar,
    Autocomplete,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useForm, Controller, FieldValues } from "react-hook-form";
import useCreateData from "@/hooks/post-global";
import useGlobalData from "@/hooks/get-global";

// تعريف نوع بيانات السيارة
type Car = {
    driver_id: string;
    car_name: string;
    lamp_number: string;
    plate_number: string;
    car_details: string;
};

// تعريف نوع بيانات السائق المسترجع
type Driver = {
    driver_id: string;
    name: string;
    has_taxi: boolean;
};

const CreateCarForm = () => {
    // جلب السائقين من API الذين لديهم has_taxi === false
    const { data: GlobalData, isLoading: GlobalLoading, refetch } = useGlobalData<Driver | any>({
        dataSourceName: "api/drivers",
        enabled: true,
        setOldDataAsPlaceholder: true,
    });

    // حفظ قائمة السائقين المتاحين
    const [availableDrivers, setAvailableDrivers] = useState<Driver[]>([]);

    useEffect(() => {
        if (GlobalData) {
            const filteredDrivers = GlobalData?.data.filter((driver: any) => !driver.has_taxi);
            setAvailableDrivers(filteredDrivers);
        }
    }, [GlobalData]);

    const { isLoading, isError, success, createData } = useCreateData<Car>({
        dataSourceName: "api/taxis",
    });

    const router = useRouter();
    const [openAlert, setOpenAlert] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string>("");
    const [alertSeverity, setAlertSeverity] = useState<"error" | "success">("success");

    const { control, handleSubmit, setValue, formState: { errors } } = useForm<Car>({
        defaultValues: {
            driver_id: "",
            car_name: "",
            lamp_number: "",
            plate_number: "",
            car_details: "",
        },
    });

    const handleCreate = async (data: Car) => {
        await createData(data);

        if (success) {
            setAlertMessage("تمت إضافة السيارة بنجاح!");
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
            {/* التنبيه */}
            <Snackbar open={openAlert} autoHideDuration={6000} onClose={() => setOpenAlert(false)}>
                <Alert onClose={() => setOpenAlert(false)} severity={alertSeverity} sx={{ width: "100%" }}>
                    {alertMessage}
                </Alert>
            </Snackbar>

            <Typography variant="h4" gutterBottom sx={{ textAlign: "right" }}>
                إضافة سيارة جديدة
            </Typography>

            <Grid container spacing={2}>
                {/* اختيار السائق */}
                <Grid item xs={12}>
                    <Controller
                        name="driver_id"
                        control={control}
                        render={({ field }) => (
                            <Autocomplete
                                value={availableDrivers.find((driver) => driver.driver_id === field.value) || null}
                                options={availableDrivers}
                                getOptionLabel={(option) => option.name}
                                onChange={(_, value) => field.onChange(value ? value.driver_id : "")}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="السائق"
                                        variant="outlined"
                                        error={!!errors.driver_id}
                                        helperText={errors.driver_id ? "يجب اختيار سائق" : ""}
                                        fullWidth
                                    />
                                )}
                            />
                        )}
                    />
                </Grid>

                {/* اسم السيارة */}
                <Grid item xs={12}>
                    <Controller
                        name="car_name"
                        control={control}
                        render={({ field }: { field: FieldValues }) => (
                            <TextField
                                fullWidth
                                label="اسم السيارة"
                                variant="outlined"
                                {...field}
                                error={!!errors.car_name}
                                helperText={errors.car_name ? "اسم السيارة مطلوب" : ""}
                            />
                        )}
                    />
                </Grid>

                {/* رقم اللمبة */}
                <Grid item xs={12}>
                    <Controller
                        name="lamp_number"
                        control={control}
                        render={({ field }: { field: FieldValues }) => (
                            <TextField
                                fullWidth
                                label="رقم اللمبة"
                                variant="outlined"
                                {...field}
                                error={!!errors.lamp_number}
                                helperText={errors.lamp_number ? "رقم اللمبة مطلوب" : ""}
                            />
                        )}
                    />
                </Grid>

                {/* رقم اللوحة */}
                <Grid item xs={12}>
                    <Controller
                        name="plate_number"
                        control={control}
                        render={({ field }: { field: FieldValues }) => (
                            <TextField
                                fullWidth
                                label="رقم اللوحة"
                                variant="outlined"
                                {...field}
                                error={!!errors.plate_number}
                                helperText={errors.plate_number ? "رقم اللوحة مطلوب" : ""}
                            />
                        )}
                    />
                </Grid>

                {/* تفاصيل السيارة */}
                <Grid item xs={12}>
                    <Controller
                        name="car_details"
                        control={control}
                        render={({ field }: { field: FieldValues }) => (
                            <TextField
                                fullWidth
                                label="تفاصيل السيارة"
                                variant="outlined"
                                multiline
                                rows={3}
                                {...field}
                                error={!!errors.car_details}
                                helperText={errors.car_details ? "تفاصيل السيارة مطلوبة" : ""}
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
                        disabled={isLoading || GlobalLoading}
                    >
                        {isLoading || GlobalLoading ? <CircularProgress size={24} color="inherit" /> : "إضافة"}
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default CreateCarForm;
