"use client";
import React, { useEffect, useState } from "react";
import {
    TextField,
    Button,
    Grid,
    Typography,
    CircularProgress,
    Box,
    Alert,
    Input,
    FormControl,
    InputLabel,
    Snackbar,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import Cookies from "js-cookie";

// تعريف نوع الإعلان
type Advertisement = {
    id: string;
    admin_id: string;
    title: string;
    description: string;
    validity_date: string;
    image: File | null;
    logo: File | null;
};

const token = Cookies.get("auth_user");

function EditAdvertisements({ data, onSuccess }: { data: Advertisement; onSuccess?: () => void }) {
    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
    } = useForm<Advertisement>({
        defaultValues: { ...data },
    });

    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [selectedLogo, setSelectedLogo] = useState<File | null>(null);
    const [alert, setAlert] = useState<{ open: boolean; message: string; severity: "error" | "success" }>({
        open: false,
        message: "",
        severity: "success",
    });
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (data) {
            setValue("title", data.title);
            setValue("description", data.description);
            setValue("validity_date", data.validity_date);
        }
    }, [data, setValue]);

    const handleFileChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        type: "image" | "logo"
    ) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
            if (!allowedTypes.includes(file.type)) {
                setAlert({ open: true, message: "يرجى اختيار صورة بصيغة JPEG أو PNG.", severity: "error" });
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                setAlert({ open: true, message: "حجم الملف يجب أن يكون أقل من 5MB!", severity: "error" });
                return;
            }
            if (type === "image") setSelectedImage(file);
            if (type === "logo") setSelectedLogo(file);
        }
    };

    const handleUpdate = async (updatedData: Advertisement) => {
        if (!updatedData.title || !updatedData.description || !updatedData.validity_date) {
            setAlert({ open: true, message: "يرجى ملء جميع الحقول المطلوبة!", severity: "error" });
            return;
        }

        const formData = new FormData();
        formData.append("title", updatedData.title);
        formData.append("description", updatedData.description);
        formData.append("validity_date", updatedData.validity_date);
        if (selectedImage) formData.append("image", selectedImage);
        if (selectedLogo) formData.append("logo", selectedLogo);

        try {
            setIsLoading(true);
            const response = await fetch(`https://tawsella.online/api/advertisements/${data.id}`, {
                method: "POST",
                body: formData,
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const result = await response.json();
            if (response.ok) {
                setAlert({ open: true, message: "تم التحديث بنجاح!", severity: "success" });
                reset();
                setSelectedImage(null);
                setSelectedLogo(null);
                if (onSuccess) onSuccess();
            } else {
                setAlert({ open: true, message: `خطأ: ${result.message || "حدث خطأ أثناء التحديث"}`, severity: "error" });
            }
        } catch (error) {
            setAlert({ open: true, message: "حدث خطأ أثناء الإرسال، يرجى المحاولة مرة أخرى.", severity: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box sx={{ width: "100%", maxWidth: 600, margin: "0 auto" }}>
            <Snackbar open={alert.open} autoHideDuration={6000} onClose={() => setAlert({ ...alert, open: false })}>
                <Alert onClose={() => setAlert({ ...alert, open: false })} severity={alert.severity} sx={{ width: "100%" }}>
                    {alert.message}
                </Alert>
            </Snackbar>
            <Typography variant="h4" gutterBottom sx={{ textAlign: "right" }}>
                تعديل الإعلان
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Controller
                        name="title"
                        control={control}
                        rules={{ required: "العنوان مطلوب" }}
                        render={({ field }) => (
                            <TextField fullWidth label="العنوان" variant="outlined" {...field} error={!!errors.title} helperText={errors.title?.message} />
                        )}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Controller
                        name="description"
                        control={control}
                        rules={{ required: "الوصف مطلوب" }}
                        render={({ field }) => (
                            <TextField fullWidth label="الوصف" variant="outlined" multiline rows={4} {...field} error={!!errors.description} helperText={errors.description?.message} />
                        )}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Controller
                        name="validity_date"
                        control={control}
                        rules={{ required: "تاريخ الصلاحية مطلوب" }}
                        render={({ field }) => (
                            <TextField fullWidth label="تاريخ الصلاحية" type="date" variant="outlined" InputLabelProps={{ shrink: true }} {...field} error={!!errors.validity_date} helperText={errors.validity_date?.message} />
                        )}
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormControl fullWidth>
                        <InputLabel>صورة الإعلان</InputLabel>
                        <Input type="file" inputProps={{ accept: "image/*" }} onChange={(e: any) => handleFileChange(e, "image")} />
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <Button fullWidth variant="contained" color="primary" onClick={handleSubmit(handleUpdate)} disabled={isLoading}>
                        {isLoading ? <CircularProgress size={24} color="inherit" /> : "تحديث"}
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
}

export default EditAdvertisements;
