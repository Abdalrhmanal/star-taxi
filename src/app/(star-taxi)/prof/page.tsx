"use client";
import React, { useState, useEffect } from 'react';
import useGlobalData from '@/hooks/get-global';
import useCreateData from '@/hooks/post-global';
import { Box, Button, TextField, Typography, Grid, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

interface Profile {
    id: string;
    name: string;
    phone_number: string;
    email: string;
    address: string;
    password?: string;
}

function Profile() {
    const [isEditMode, setIsEditMode] = useState(false);
    const [isPasswordChangeMode, setIsPasswordChangeMode] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formData, setFormData] = useState<Profile>({
        id: '',
        name: '',
        phone_number: '',
        email: '',
        address: '',
    });

    const { data: profData } = useGlobalData<any>({
        dataSourceName: "api/profile",
        enabled: true,
        setOldDataAsPlaceholder: true,
    });
    const globalData = profData?.data;

    const { createData } = useCreateData<Profile>({
        dataSourceName: "api/profile",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleEditToggle = () => {
        setIsEditMode(!isEditMode);
        if (!isEditMode && globalData) {
            setFormData({
                id: globalData.id,
                name: globalData.name,
                phone_number: globalData.phone_number,
                email: globalData.email,
                address: globalData.address,
            });
        }
    };

    const handlePasswordToggle = () => {
        setIsPasswordChangeMode(prev => {
            if (prev) {
                setFormData(prevData => ({ ...prevData, password: '' }));
                setConfirmPassword('');
                setShowPassword(false);
                setShowConfirmPassword(false);
            }
            return !prev;
        });
    };

    const handleSaveChanges = () => {
        if (formData.password && formData.password !== confirmPassword) {
            alert('كلمات المرور غير متطابقة');
            return;
        }

        const dataToSend: Partial<Profile> = {
            address: formData.address,
            email: formData.email,
            name: formData.name,
            phone_number: formData.phone_number,
        };

        if (formData.password) {
            dataToSend.password = formData.password;
        }

        createData(dataToSend as Profile);
        setIsEditMode(false);
        handlePasswordToggle();
        alert('تم حفظ التغييرات بنجاح');
    };

    useEffect(() => {
        if (globalData) {
            setFormData({
                id: globalData.id,
                name: globalData.name,
                phone_number: globalData.phone_number,
                email: globalData.email,
                address: globalData.address,
            });
        }
    }, [globalData]);

    return (
        <Box sx={{ padding: '2rem' }}>
            <Typography variant="h4" gutterBottom>
                الملف الشخصي
            </Typography>

            {/* Main Form Fields */}
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="الاسم"
                        name="name"
                        value={formData.name || ''}
                        onChange={handleChange}
                        fullWidth
                        disabled={!isEditMode}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="رقم الهاتف"
                        name="phone_number"
                        value={formData.phone_number || ''}
                        onChange={handleChange}
                        fullWidth
                        disabled={!isEditMode}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="البريد الإلكتروني"
                        name="email"
                        value={formData.email || ''}
                        onChange={handleChange}
                        fullWidth
                        disabled={!isEditMode}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="العنوان"
                        name="address"
                        value={formData.address || ''}
                        onChange={handleChange}
                        fullWidth
                        disabled={!isEditMode}
                    />
                </Grid>
            </Grid>

            {/* Password Change Section */}
            {isPasswordChangeMode && (
                <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="كلمة المرور الجديدة"
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password || ''}
                            onChange={handleChange}
                            fullWidth
                            disabled={!isEditMode}
                            InputProps={{
                                endAdornment: isEditMode && (
                                    <IconButton
                                        onClick={() => setShowPassword(prev => !prev)}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                )
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="تأكيد كلمة المرور"
                            type={showConfirmPassword ? "text" : "password"}
                            fullWidth
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={!isEditMode}
                            InputProps={{
                                endAdornment: isEditMode && (
                                    <IconButton
                                        onClick={() => setShowConfirmPassword(prev => !prev)}
                                        edge="end"
                                    >
                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                )
                            }}
                        />
                    </Grid>
                </Grid>
            )}

            <Box sx={{ mt: 2 }}>
                {isEditMode ? (
                    <Button variant="contained" color="primary" onClick={handleSaveChanges}>
                        حفظ التعديلات
                    </Button>
                ) : (
                    <Button variant="outlined" color="primary" onClick={handleEditToggle}>
                        تعديل الملف الشخصي
                    </Button>
                )}

                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handlePasswordToggle}
                    sx={{ ml: 2 }}
                >
                    {isPasswordChangeMode ? 'إلغاء تغيير كلمة المرور' : 'تغيير كلمة المرور'}
                </Button>
            </Box>
        </Box>
    );
}

export default Profile;