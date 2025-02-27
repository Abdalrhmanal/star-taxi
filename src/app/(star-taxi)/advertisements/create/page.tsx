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
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import useCreateData from "@/hooks/post-global";
import { useRouter } from "next/navigation";
import HeaderPageD from "@/components/header-page";

// تعريف نوع البيانات
type Advertisement = {
    admin_id: string;
    title: string;
    description: string;
    validity_date: string;
    image: File | null;
    logo: File | null;
};

const CreateAdvertisements = () => {
    const { isLoading, isError, success, createData } = useCreateData<FormData>({
        dataSourceName: "api/advertisements",
    });

    const router = useRouter();
    const [openAlert, setOpenAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertSeverity, setAlertSeverity] = useState<"error" | "success">("success");

    const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<Advertisement>({
        defaultValues: {
            admin_id: "2e298731-ca8c-46c6-a99e-40588f0710d7",
            title: "",
            description: "",
            validity_date: "2025-02-28T15:04:04",
            image: null,
            logo: null,
        },
    });

    // **متابعة اختيار الملفات**
    const selectedImage = watch("image");
    const selectedLogo = watch("logo");

    // **دالة التحقق من الملف**
    const handleFileChange = (file: File, fieldName: "image" | "logo") => {
        if (file.size > 5 * 1024 * 1024) {
            setAlertMessage("حجم الملف يجب أن يكون أقل من 5MB!");
            setAlertSeverity("error");
            setOpenAlert(true);
            return false;
        }

        setValue(fieldName, file, { shouldValidate: true });
        return true;
    };

    // **دالة معالجة الإرسال**
    const handleCreate = async (data: Advertisement) => {
        if (!data.title) {
            setAlertMessage("عنوان الإعلان مطلوب");
            setAlertSeverity("error");
            setOpenAlert(true);
            return;
        }
        if (!data.description) {
            setAlertMessage("وصف الإعلان مطلوب");
            setAlertSeverity("error");
            setOpenAlert(true);
            return;
        }
        if (!data.image || !data.logo) {
            setAlertMessage("يجب تحميل صورة الإعلان والشعار");
            setAlertSeverity("error");
            setOpenAlert(true);
            return;
        }

        // **إنشاء `FormData`**
        const formData = new FormData();
        formData.append("admin_id", data.admin_id);
        formData.append("title", data.title);
        formData.append("description", data.description);
        formData.append("validity_date", data.validity_date);
        
        // ✅ **إضافة الصور فقط إذا كانت متاحة**
        if (data.image) formData.append("image", data.image);
        if (data.logo) formData.append("logo", data.logo);

        try {
            const response = await fetch("https://tawsella.online/api/advertisements", {
                method: "POST",
                body: formData,
                headers: {
                    "Accept": "application/json",
                    "Authorization": "Bearer 17|c8mxBjLNEJwNn6XaACZ2EHWXrl5gujs517Zw8O4Ue3b7f312",
                },
            });

            const result = await response.json();
            if (response.ok) {
                setAlertMessage("تمت إضافة الإعلان بنجاح!");
                setAlertSeverity("success");
                setOpenAlert(true);
                router.back();
            } else {
                setAlertMessage(`خطأ: ${result.message || "حدث خطأ أثناء الإرسال"}`);
                setAlertSeverity("error");
                setOpenAlert(true);
            }
        } catch (error) {
            setAlertMessage("حدث خطأ أثناء الإرسال، يرجى المحاولة مرة أخرى.");
            setAlertSeverity("error");
            setOpenAlert(true);
        }
    };

    return (
        <Box sx={{ width: "100%", maxWidth: 600, margin: "0 auto", padding: 3 }}>
            <HeaderPageD pluralName="الاعلانات"/>
            {/* التنبيه أعلى الصفحة */}
            <Snackbar open={openAlert} autoHideDuration={6000} onClose={() => setOpenAlert(false)}>
                <Alert onClose={() => setOpenAlert(false)} severity={alertSeverity} sx={{ width: "100%" }}>
                    {alertMessage}
                </Alert>
            </Snackbar>

            <Typography variant="h4" gutterBottom sx={{ textAlign: "right" }}>
                إضافة إعلان جديد
            </Typography>

            <Grid container spacing={2}>
                {/* عنوان الإعلان */}
                <Grid item xs={12}>
                    <Controller
                        name="title"
                        control={control}
                        rules={{ required: "عنوان الإعلان مطلوب" }}
                        render={({ field }) => (
                            <TextField
                                fullWidth
                                label="عنوان الإعلان"
                                variant="outlined"
                                {...field}
                                error={!!errors.title}
                                helperText={errors.title ? errors.title.message : ""}
                                sx={{ textAlign: "right" }}
                            />
                        )}
                    />
                </Grid>

                {/* وصف الإعلان */}
                <Grid item xs={12}>
                    <Controller
                        name="description"
                        control={control}
                        rules={{ required: "وصف الإعلان مطلوب" }}
                        render={({ field }) => (
                            <TextField
                                fullWidth
                                label="الوصف"
                                variant="outlined"
                                multiline
                                rows={3}
                                {...field}
                                error={!!errors.description}
                                helperText={errors.description ? errors.description.message : ""}
                                sx={{ textAlign: "right" }}
                            />
                        )}
                    />
                </Grid>

                {/* رفع صورة الإعلان */}
                <Grid item xs={12}>
                    <Typography variant="body1">صورة الإعلان:</Typography>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                                handleFileChange(e.target.files[0], "image");
                            }
                        }}
                    />
                    {selectedImage && <Typography variant="body2" sx={{ color: "green" }}>✅ تم اختيار الصورة</Typography>}
                </Grid>

                {/* رفع شعار الإعلان */}
                <Grid item xs={12}>
                    <Typography variant="body1">شعار الإعلان:</Typography>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                                handleFileChange(e.target.files[0], "logo");
                            }
                        }}
                    />
                    {selectedLogo && <Typography variant="body2" sx={{ color: "green" }}>✅ تم اختيار الشعار</Typography>}
                </Grid>

                {/* تاريخ الصلاحية */}
                <Grid item xs={12}>
                    <Controller
                        name="validity_date"
                        control={control}
                        rules={{ required: "تاريخ الصلاحية مطلوب" }}
                        render={({ field }) => (
                            <TextField
                                fullWidth
                                label="تاريخ الصلاحية"
                                variant="outlined"
                                type="datetime-local"
                                InputLabelProps={{ shrink: true }}
                                {...field}
                                error={!!errors.validity_date}
                                helperText={errors.validity_date ? errors.validity_date.message : ""}
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
                        {isLoading ? <CircularProgress size={24} color="inherit" /> : "إضافة الإعلان"}
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default CreateAdvertisements;