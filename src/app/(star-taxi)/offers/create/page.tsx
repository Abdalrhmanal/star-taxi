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
import useCreateData from "@/hooks/post-global";
import useGlobalData from "@/hooks/get-global";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import HeaderPageD from "@/components/header-page";

// تعريف نوع العرض
type Offer = {
    movement_type_id: string;
    offer: string;
    value_of_discount: number;
    valid_date: string;
    description: string;
};

// تعريف نوع الحركة
type MovementType = {
    id: string;
    type: string;
};

// تعريف نوع البيانات القادمة من API
interface GlobalDataType {
    data: {
        movementTypes: MovementType[];
    };
}

// مكون إنشاء عرض جديد
const CreateOffer = () => {
    const { isLoading, isError, success, createData } = useCreateData<Offer>({
        dataSourceName: "api/offers",
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
            movement_type_id: "",
            offer: "",
            value_of_discount: 0,
            valid_date: "",
            description: "",
        },
    });

    // دالة معالجة الإرسال
    const handleCreate = async (data: Offer) => {
        if (!data.movement_type_id) {
            setAlertMessage("الرجاء اختيار نوع الحركة");
            setAlertSeverity("error");
            setOpenAlert(true);
            return;
        }
        if (!data.offer) {
            setAlertMessage("العرض مطلوب");
            setAlertSeverity("error");
            setOpenAlert(true);
            return;
        }
        if (data.value_of_discount <= 0) {
            setAlertMessage("قيمة الخصم يجب أن تكون أكبر من 0");
            setAlertSeverity("error");
            setOpenAlert(true);
            return;
        }
        if (!data.valid_date) {
            setAlertMessage("تاريخ الصلاحية مطلوب");
            setAlertSeverity("error");
            setOpenAlert(true);
            return;
        }

        await createData(data);

        if (success) {
            setAlertMessage("تمت إضافة العرض بنجاح!");
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
            <HeaderPageD pluralName="العروض"/>
            <Snackbar open={openAlert} autoHideDuration={6000} onClose={() => setOpenAlert(false)}>
                <Alert onClose={() => setOpenAlert(false)} severity={alertSeverity} sx={{ width: "100%" }}>
                    {alertMessage}
                </Alert>
            </Snackbar>

            <Typography variant="h4" gutterBottom sx={{ textAlign: "right" }}>
                إضافة عرض جديد
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
                                value={selectedMovementType} // ✅ القيمة الآن هي كائن وليس `string`
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

export default CreateOffer;
