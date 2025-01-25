import React, { useState } from "react";
import {
    IconButton,
    Typography,
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    Drawer,
    TextField,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRouter } from 'next/navigation';

const ActionsCell: React.FC<{ row: any }> = ({ row }) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const router = useRouter();
    console.log(row);

    // وظيفة عرض الصفحة
    const handleView = () => {
        router.push(`/drivers/${row.driver_id}`);
    };

    // وظيفة فتح درور التعديل
    const handleEdit = () => {
        setIsDrawerOpen(true);
    };

    // وظيفة فتح نافذة التأكيد للحذف
    const handleDelete = () => {
        setIsDialogOpen(true);
    };

    // تأكيد الحذف
    const confirmDelete = () => {
        console.log(`تم حذف الريكورد: ${row.driver_id}`);
        setIsDialogOpen(false);
    };

    return (
        <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
            {/* زر العرض */}
            <IconButton onClick={handleView}>
                <VisibilityIcon color="primary" />
            </IconButton>

            {/* زر التعديل */}
            <IconButton onClick={handleEdit}>
                <EditIcon color="secondary" />
            </IconButton>

            {/* زر الحذف */}
            <IconButton onClick={handleDelete}>
                <DeleteIcon color="error" />
            </IconButton>

            {/* نافذة منبثقة لتأكيد الحذف */}
            <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
                <DialogTitle>تأكيد الحذف</DialogTitle>
                <DialogContent>
                    <Typography>هل أنت متأكد أنك تريد حذف هذا الريكورد؟</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsDialogOpen(false)}>إلغاء</Button>
                    <Button onClick={confirmDelete} color="error">
                        حذف
                    </Button>
                </DialogActions>
            </Dialog>

            {/* درور التعديل */}
            <Drawer
                anchor="right"
                open={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
            >
                <Box sx={{ width: 300, p: 2 }}>
                    <Typography variant="h6" mb={2}>
                        تعديل الريكورد
                    </Typography>
                    {/* الحقول المسؤولة عن التعديل */}
                    <TextField
                        fullWidth
                        label="الاسم"
                        defaultValue={row.name}
                        variant="outlined"
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="العمر"
                        defaultValue={row.age}
                        variant="outlined"
                        sx={{ mb: 2 }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={() => {
                            console.log("تم تعديل الريكورد:", row.driver_id);
                            setIsDrawerOpen(false);
                        }}
                    >
                        حفظ
                    </Button>
                </Box>
            </Drawer>
        </Box>
    );
};

export default ActionsCell;
