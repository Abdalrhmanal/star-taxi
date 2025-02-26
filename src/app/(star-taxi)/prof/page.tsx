"use client";
import React, { useState, useEffect } from 'react';
import useGlobalData from '@/hooks/get-global';
import useCreateData from '@/hooks/post-global';
import { Box, Button, TextField, Typography, Avatar, Grid, InputLabel, FormControl, Select, MenuItem, SelectChangeEvent } from '@mui/material';

interface Profile {
    id: string;
    name: string;
    gender: number;
    avatar: string;
    phone_number: string;
    email: string;
    address: string; // استخدم string بدلاً من string | null
}

function Profile() {
    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState<Profile>({
        id: '',
        name: '',
        gender: 0,
        avatar: '',
        phone_number: '',
        email: '',
        address: '', // استخدم '' بدلاً من null
    });

    const { data: profData } = useGlobalData<any>({
        dataSourceName: "api/profile",
        enabled: true,
        setOldDataAsPlaceholder: true,
    });
    const globalData = profData?.data;

    const { isLoading, isError, success, createData } = useCreateData<Profile>({
        dataSourceName: "api/profile",
    });

    // Handle form change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<number>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value || '' });
    };

    // Handle edit mode toggle
    const handleEditToggle = () => {
        setIsEditMode(!isEditMode);
        if (!isEditMode && globalData) {
            setFormData(globalData);
        }
    };

    // Handle save changes
    const handleSaveChanges = () => {
        const updatedData = { ...globalData, ...formData };
        createData(updatedData);
        setIsEditMode(false);
    };

    // Update formData when GlobalData changes
    useEffect(() => {
        if (globalData) {
            setFormData(globalData);
        }
    }, [globalData]);

    return (
        <Box sx={{ padding: '2rem' }}>
            <Typography variant="h4" gutterBottom>
                Profile
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <Avatar src={`https://tawsella.online/${formData.avatar}`} sx={{ width: 100, height: 100 }} />
                    {isEditMode && (
                        <>
                            <Button variant="outlined" color="primary">
                                Choose file
                            </Button>
                            <Button variant="outlined" color="error">
                                Delete image
                            </Button>
                        </>
                    )}
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Name"
                        name="name"
                        value={formData.name || ''}
                        onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>)}
                        fullWidth
                        disabled={!isEditMode}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                        <InputLabel>Gender</InputLabel>
                        <Select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            disabled={!isEditMode}
                        >
                            <MenuItem value={0}>Male</MenuItem>
                            <MenuItem value={1}>Female</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Phone Number"
                        name="phone_number"
                        value={formData.phone_number || ''}
                        onChange={handleChange}
                        fullWidth
                        disabled={!isEditMode}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Email"
                        name="email"
                        value={formData.email || ''}
                        onChange={handleChange}
                        fullWidth
                        disabled={!isEditMode}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Address"
                        name="address"
                        value={formData.address || ''}
                        onChange={handleChange}
                        fullWidth
                        disabled={!isEditMode}
                    />
                </Grid>
            </Grid>
            <Box sx={{ mt: 2 }}>
                {isEditMode ? (
                    <Button variant="contained" color="primary" onClick={handleSaveChanges}>
                        Save Changes
                    </Button>
                ) : (
                    <Button variant="outlined" color="primary" onClick={handleEditToggle}>
                        Edit Profile
                    </Button>
                )}
            </Box>
        </Box>
    );
}

export default Profile;