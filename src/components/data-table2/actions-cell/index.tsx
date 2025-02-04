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
    Alert,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRouter } from 'next/navigation';
import EditDriver from "@/app/(star-taxi)/drivers/edit/page";
import useDeleteData from "@/hooks/delete-global";
import EditCar from "@/app/(star-taxi)/taxis/edit/page";
import EditOffer from "@/app/(star-taxi)/offers/edit/page";
import EditMovementType from "@/app/(star-taxi)/movement-types/edit/page";

const ActionsCell: React.FC<{ row: any, onDataUpdated: () => void }> = ({ row, onDataUpdated }) => {
    const currentPath = window.location.pathname;
    const id = row.driver_id || row.id;
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { isLoading, isError, success, deleteData } = useDeleteData({
        dataSourceName: `api${currentPath + '/' + id}`,
    });
    const router = useRouter();
    // وظيفة عرض الصفحة
    const handleView = () => {

        router.push(`${currentPath + '/' + id}`);
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
    const confirmDelete = async () => {
        const confirm = window.confirm("هل أنت متأكد أنك تريد حذف هذا العنصر؟");
        if (confirm) {
            await deleteData(id);
            onDataUpdated(); // استدعاء دالة المكون الأب بعد نجاح الحذف
        }
        setIsDialogOpen(false);
    };

    return (
        <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
            {/* زر العرض */}
            {/*   <IconButton onClick={handleView}>
                <VisibilityIcon color="primary" />
            </IconButton> */}

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
                    <Button onClick={confirmDelete} color="error" disabled={isLoading}>
                        {isLoading ? "جاري الحذف..." : "حذف"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* درور التعديل */}
            <Drawer
                anchor="left"
                open={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
            >
                <Box sx={{ width: 500, padding: 3 }}>
                    {currentPath === "/drivers" && <EditDriver data={row} />}
                    {currentPath === "/taxis" && <EditCar data={row} />}
                    {currentPath === "/offers" && <EditOffer data={row} />}
                    {currentPath === "/movement-types" && <EditMovementType data={row} />}
                    {currentPath !== "/drivers" && currentPath !== "/taxis" && <></>}
                </Box>
            </Drawer>

            {/* عرض رسالة الخطأ أو النجاح */}
            {(isError || success) && (
                <Alert
                    severity={isError ? "error" : "success"}
                    sx={{
                        position: "fixed", // لوضعها فوق الصفحة
                        top: 16, // المسافة من أعلى الصفحة
                        left: "50%", // توسيط العنصر
                        transform: "translateX(-50%)", // توسيط العنصر بشكل دقيق
                        width: "auto", // ضبط العرض
                        zIndex: 9999, // التأكد من أن الرسالة تظهر فوق العناصر الأخرى
                    }}
                >
                    {isError ? `خطأ: ${isError}` : "تم الحذف بنجاح!"}
                </Alert>
            )}
        </Box>
    );
};

export default ActionsCell;
