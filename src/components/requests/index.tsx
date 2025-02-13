"use client";
import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Drawer, Grid, TextField, Snackbar, Alert } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import useGlobalData from "@/hooks/get-global";
import { useForm, Controller } from "react-hook-form";
import useCreateData from "@/hooks/post-global";

interface Driver {
  driver_id: string;
  name: string;
  has_taxi: boolean;
}

function Requests({ selectedOrder }: any) {
  // حالات فتح/إغلاق Drawers
  const [openAcceptDrawer, setOpenAcceptDrawer] = useState(false);
  const [openRejectDrawer, setOpenRejectDrawer] = useState(false);

  // جلب قائمة السائقين المتاحين
  const { data: GlobalData } = useGlobalData<Driver | any>({
    dataSourceName: "api/drivers",
    enabled: true,
    setOldDataAsPlaceholder: true,
  });

  const [availableDrivers, setAvailableDrivers] = useState<Driver[]>([]);
  useEffect(() => {
    if (GlobalData?.data) {
      const filteredDrivers = GlobalData?.data.filter((driver: any) => driver.driver_state === "Ready");
      setAvailableDrivers(filteredDrivers);
    }
  }, [GlobalData]);

  // **📌 قبول الطلب**
  const {
    control: acceptControl,
    handleSubmit: handleAcceptSubmit,
    setValue: setAcceptValue,
    watch: watchAccept,
    formState: { errors: acceptErrors },
  } = useForm<{ driver_id: string }>({
    defaultValues: { driver_id: "" },
  });

  const selectedDriverId = watchAccept("driver_id");

  const { isLoading: acceptLoading, isError: acceptError, success: acceptSuccess, createData: acceptData } =
    useCreateData<any>({
      dataSourceName: `api/taxi-movement/accept/${selectedOrder.id}`,
    });

  const handleAccept = async () => {
    if (!selectedDriverId) return;
    await acceptData({ driver_id: selectedDriverId });

    if (acceptSuccess) {
      setOpenAcceptDrawer(false);
      setNotificationMessage(`✅ تم قبول الطلب وتم تعيين السائق ${availableDrivers.find((d) => d.driver_id === selectedDriverId)?.name}!`);
      setNotificationSeverity("success");
      setNotificationOpen(true);
    } else if (acceptError) {
      setNotificationMessage("❌ حدث خطأ أثناء قبول الطلب. الرجاء المحاولة مجددًا.");
      setNotificationSeverity("error");
      setNotificationOpen(true);
    }
  };

  // **📌 رفض الطلب**
  const {
    control: rejectControl,
    handleSubmit: handleRejectSubmit,
    setValue: setRejectValue,
    formState: { errors: rejectErrors },
  } = useForm<{ message: string }>({
    defaultValues: { message: "" },
  });

  const { isLoading: rejectLoading, isError: rejectError, success: rejectSuccess, createData: rejectData } =
    useCreateData<any>({
      dataSourceName: `api/taxi-movement/reject/${selectedOrder.id}`,
    });

  const handleReject = async (data: { message: string }) => {
    await rejectData(data);

    if (rejectSuccess) {
      setOpenRejectDrawer(false);
      setNotificationMessage("❌ تم رفض الطلب بنجاح.");
      setNotificationSeverity("success");
      setNotificationOpen(true);
    } else if (rejectError) {
      setNotificationMessage("❌ حدث خطأ أثناء رفض الطلب. الرجاء المحاولة مجددًا.");
      setNotificationSeverity("error");
      setNotificationOpen(true);
    }
  };

  // حالة الإشعار عند نجاح العملية أو فشلها
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationSeverity, setNotificationSeverity] = useState<"success" | "error">("success");

  const handleCloseNotification = () => {
    setNotificationOpen(false);
  };

  return (
    <>
      {/* صندوق الطلب */}
      <Box sx={{ backgroundColor: "white", padding: "20px" }}>
        <Typography variant="h6" fontWeight="bold">
          تفاصيل الطلب
        </Typography>
        <Typography fontSize="16px">🚖 العميل: {selectedOrder.customer}</Typography>
        <Typography fontSize="16px">📍 العنوان الحالي: {selectedOrder.customer_address}</Typography>
        <Typography fontSize="16px">🎯 الوجهة: {selectedOrder.destination_address}</Typography>
        <Typography fontSize="16px">⏰ وقت الطلب: {selectedOrder.time}</Typography>

        <Box display="flex" justifyContent="space-between" mt={2}>
          <Button variant="contained" color="success" size="large" onClick={() => setOpenAcceptDrawer(true)}>
            ✅ قبول الطلب
          </Button>
          <Button variant="contained" color="error" size="large" onClick={() => setOpenRejectDrawer(true)}>
            ❌ رفض الطلب
          </Button>
        </Box>
      </Box>

      {/* Drawer قبول الطلب */}
      <Drawer anchor="right" open={openAcceptDrawer} onClose={() => setOpenAcceptDrawer(false)}>
        <Box sx={{ width: 350, padding: 3 }}>
          <Typography variant="h6" fontWeight="bold">
            اختر سائقًا للطلب
          </Typography>

          <Grid item xs={12} mt={2}>
            <Controller
              name="driver_id"
              control={acceptControl}
              rules={{ required: "يجب اختيار سائق" }}
              render={({ field }) => (
                <Autocomplete
                  value={availableDrivers.find((driver) => driver.driver_id === field.value) || null}
                  options={availableDrivers}
                  getOptionLabel={(option) => option.name}
                  onChange={(_, value) => setAcceptValue("driver_id", value ? value.driver_id : "")}
                  renderInput={(params) => (
                    <TextField {...params} label="السائق" variant="outlined" error={!!acceptErrors.driver_id} helperText={acceptErrors.driver_id ? "يجب اختيار سائق" : ""} fullWidth />
                  )}
                />
              )}
            />
          </Grid>

          <Button fullWidth variant="contained" color="primary" size="large" sx={{ mt: 3 }} disabled={acceptLoading} onClick={handleAcceptSubmit(handleAccept)}>
            تأكيد القبول
          </Button>
        </Box>
      </Drawer>

      {/* Drawer رفض الطلب */}
      <Drawer anchor="right" open={openRejectDrawer} onClose={() => setOpenRejectDrawer(false)}>
        <Box sx={{ width: 350, padding: 3 }}>
          <Typography variant="h6" fontWeight="bold">
            سبب رفض الطلب
          </Typography>

          <Grid item xs={12} mt={2}>
            <Controller
              name="message"
              control={rejectControl}
              rules={{ required: "يجب كتابة سبب الرفض" }}
              render={({ field }) => (
                <TextField {...field} label="سبب الرفض" variant="outlined" error={!!rejectErrors.message} helperText={rejectErrors.message ? "يجب كتابة سبب الرفض" : ""} fullWidth multiline rows={3} />
              )}
            />
          </Grid>

          <Button fullWidth variant="contained" color="error" size="large" sx={{ mt: 3 }} disabled={rejectLoading} onClick={handleRejectSubmit(handleReject)}>
            تأكيد الرفض
          </Button>
        </Box>
      </Drawer>

      {/* إشعار تأكيد القبول أو الرفض أو الفشل */}
      <Snackbar open={notificationOpen} autoHideDuration={6000} onClose={handleCloseNotification}>
        <Alert onClose={handleCloseNotification} severity={notificationSeverity} sx={{ width: "100%" }}>
          {notificationMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default Requests;
