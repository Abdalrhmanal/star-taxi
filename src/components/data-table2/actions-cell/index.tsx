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
    DialogContentText,
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
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import useCreateData from "@/hooks/post-global";

const ActionsCell: React.FC<{ row: any, onDataUpdated: () => void }> = ({ row, onDataUpdated }) => {
    const currentPath = typeof window !== "undefined" ? window.location.pathname : "";
    const id = row.driver_id || row.id;
    
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
    const [selectedDriver, setSelectedDriver] = useState<any>(null);

    const { isLoading, isError, success, deleteData } = useDeleteData({
        dataSourceName: `api${currentPath}/${id}`,
    });

    const { isLoading: isCreating, isError: createError, success: createSuccess, createData } = useCreateData({
        dataSourceName: "api/drivers",
    });

    const router = useRouter();

    // وظيفة عرض الصفحة
    const handleView = () => {
        router.push(`${currentPath}/${id}`);
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
            onDataUpdated();
        }
        setIsDialogOpen(false);
    };

    // فتح نافذة الدفع
    const handlePaymentClick = () => {
        setSelectedDriver(row);
        setOpenPaymentDialog(true);
    };

    // تأكيد الدفع
    const confirmPayment = async () => {
        if (selectedDriver) {
            await createData(selectedDriver.driver_id);
            setOpenPaymentDialog(false);
        }
    };

    return (
        <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
            {currentPath === "/accounts" ? (
                <>
                    <IconButton onClick={handlePaymentClick}>
                        <AccountBalanceWalletIcon color="secondary" />
                    </IconButton>
                    <IconButton onClick={handleDelete}>
                        <DeleteIcon color="error" />
                    </IconButton>
                </>
            ) : (
                <>
                    {/* زر التعديل */}
                    <IconButton onClick={handleEdit}>
                        <EditIcon color="secondary" />
                    </IconButton>
                    {/* زر الحذف */}
                    <IconButton onClick={handleDelete}>
                        <DeleteIcon color="error" />
                    </IconButton>
                </>
            )}

            {/* نافذة تأكيد الحذف */}
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

            {/* نافذة تأكيد الدفع */}
            <Dialog open={openPaymentDialog} onClose={() => setOpenPaymentDialog(false)}>
                <DialogTitle>تأكيد الدفع</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        هل أنت متأكد أنك تريد إجراء الدفع لـ {selectedDriver?.name}؟
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenPaymentDialog(false)} color="primary">
                        إلغاء
                    </Button>
                    <Button onClick={confirmPayment} color="primary" disabled={isCreating}>
                        {isCreating ? "جاري الدفع..." : "تأكيد الدفع"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* درور التعديل */}
            <Drawer anchor="left" open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
                <Box sx={{ width: 500, padding: 3 }}>
                    {currentPath === "/drivers" && <EditDriver data={row} />}
                    {currentPath === "/taxis" && <EditCar data={row} />}
                    {currentPath === "/offers" && <EditOffer data={row} />}
                    {currentPath === "/movement-types" && <EditMovementType data={row} />}
                </Box>
            </Drawer>

            {/* عرض رسالة الخطأ أو النجاح */}
            {(isError || success || createError || createSuccess) && (
                <Alert
                    severity={isError || createError ? "error" : "success"}
                    sx={{
                        position: "fixed",
                        top: 16,
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "auto",
                        zIndex: 9999,
                    }}
                >
                    {isError ? `خطأ: ${isError}` : success ? "تم الحذف بنجاح!" : createError ? `خطأ: ${createError}` : "تم الدفع بنجاح!"}
                </Alert>
            )}
        </Box>
    );
};

export default ActionsCell;
