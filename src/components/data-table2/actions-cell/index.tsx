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
import MovmentLive from "@/app/(star-taxi)/requests/live/movmentlive/page";
import MovmentDone from "@/app/(star-taxi)/requests/done/movmentdone/page";
import EditSocialLinks from "@/app/(star-taxi)/social-links/edit/page";
import Page from "@/app/(star-taxi)/movement-types/edit/page";
import PageEdetOffer from "@/app/(star-taxi)/offers/edit/page";
import PageSocialLinks from "@/app/(star-taxi)/social-links/edit/page";
import PageTaxiEdit from "@/app/(star-taxi)/taxis/edit/page";
import PageEdetDriver from "@/app/(star-taxi)/drivers/edit/page";
import PageMovment from "@/app/(star-taxi)/movement-types/edit/page";

const ActionsCell: React.FC<{ row: any, onDataUpdated: () => void, onSuccess?: () => void }> = ({ row, onDataUpdated, onSuccess }) => {
    const currentPath = typeof window !== "undefined" ? window.location.pathname : "";
    const id = row.driver_id || row.id || row.movement_id;

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false); // للتحكم في درور العرض
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

    const handleView = () => {
        setIsViewDrawerOpen(true); // فتح درور العرض
    };

    const handleEdit = () => {
        setIsDrawerOpen(true);
    };

    const handleDelete = () => {
        setIsDialogOpen(true);
    };

    const confirmDelete = async () => {
        const confirm = window.confirm("هل أنت متأكد أنك تريد حذف هذا العنصر؟");
        if (confirm) {
            await deleteData(id);
            onDataUpdated();
        }
        setIsDialogOpen(false);
    };

    const handlePaymentClick = () => {
        setSelectedDriver(row);
        setOpenPaymentDialog(true);
    };

    const confirmPayment = async () => {
        if (selectedDriver) {
            if (createData) {
                await createData(selectedDriver.driver_id);
            }
            setOpenPaymentDialog(false);
        }
    };

    return (
        <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
            {(() => {
                switch (currentPath) {
                    case "/accounts":
                        return (
                            <>
                                <IconButton onClick={handlePaymentClick}>
                                    <AccountBalanceWalletIcon color="secondary" />
                                </IconButton>
                                <IconButton onClick={handleDelete}>
                                    <DeleteIcon color="error" />
                                </IconButton>
                            </>
                        );
                    case "/requests/live":
                        return (
                            <>
                                <IconButton onClick={handleEdit}>
                                    <EditIcon color="secondary" />
                                </IconButton>
                                <IconButton onClick={handleView}>
                                    <VisibilityIcon color="secondary" />
                                </IconButton>
                                {/*  <IconButton onClick={handleDelete}>
                                    <DeleteIcon color="error" />
                                </IconButton> */}
                            </>
                        );
                    case "/requests/done":
                        return (
                            <>
                                <IconButton onClick={handleEdit}>
                                    <EditIcon color="secondary" />
                                </IconButton>
                                <IconButton onClick={handleView}>
                                    <VisibilityIcon color="secondary" />
                                </IconButton>
                                <IconButton onClick={handleDelete}>
                                    <DeleteIcon color="error" />
                                </IconButton>
                            </>
                        );
                    default:
                        return (
                            <>
                                <IconButton onClick={handleEdit}>
                                    <EditIcon color="secondary" />
                                </IconButton>
                                <IconButton onClick={handleDelete}>
                                    <DeleteIcon color="error" />
                                </IconButton>
                            </>
                        );
                }
            })()}

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

            <Drawer anchor="left" open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
                <Box sx={{ width: 500, padding: 3 }}>
                    {currentPath === "/drivers" && <PageEdetDriver data={row} onSuccess={() => { setIsDrawerOpen(false); if (onSuccess) onSuccess(); }} />}
                    {currentPath === "/taxis" && <PageTaxiEdit data={row} onSuccess={() => { setIsDrawerOpen(false); if (onSuccess) onSuccess(); }} />}
                    {currentPath === "/offers" && <PageEdetOffer data={row} onSuccess={() => { setIsDrawerOpen(false); if (onSuccess) onSuccess(); }} />}
                    {currentPath === "/movement-types" && <PageMovment data={row} onSuccess={() => { setIsDrawerOpen(false); if (onSuccess) onSuccess(); }} />}
                    {currentPath === "/social-links" && <PageSocialLinks data={row} onSuccess={() => { setIsDrawerOpen(false); if (onSuccess) onSuccess(); }}/>}
                </Box>
            </Drawer>

            <Drawer anchor="right" open={isViewDrawerOpen} onClose={() => setIsViewDrawerOpen(false)}>
                <Box sx={{ width: 800, padding: 3 }}>
                    {currentPath === "/requests/live" && <MovmentLive data={row} />}
                    {currentPath === "/requests/done" && <MovmentDone data={row} />}
                </Box>
            </Drawer>

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
