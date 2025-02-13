"use client";
import React, { useState, useEffect } from "react";
import { Grid, Button, Typography, Box, Snackbar, Alert, Skeleton } from "@mui/material";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { useRouter, useSearchParams } from "next/navigation";
import getEchoInstance from "@/reverb";
import Cookies from "js-cookie";
import TabDynamis from "@/components/Dynamic-Tabs";
import useGlobalData from "@/hooks/get-global";
import Requests from "@/components/requests";

// إعدادات الخريطة
const googleMapsApiKey = "AIzaSyCz7MVXwh_VtjqnPh5auan0QCVwVce2JX0";
const mapContainerStyle = {
  width: "100%",
  height: "70vh",
};
const defaultCenter = {
  lat: 34.8021,
  lng: 38.9968,
};

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedItemId = searchParams.get("selectedItemId");
  const [isLoading, setIsLoading] = useState(false);
  const [customerLocation, setCustomerLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [customerInfo, setCustomerInfo] = useState<{ address: string; destination: string } | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [mapCenter, setMapCenter] = useState(defaultCenter);

  // جلب بيانات الطلبات
  const dataSourceName = "api/taxi-movement";
  const { data: GlobalData, isLoading: GlobalLoading, refetch } = useGlobalData<any>({
    dataSourceName,
    enabled: true,
    setOldDataAsPlaceholder: true,
  });

  // جلب `userId` من الكوكيز
  useEffect(() => {
    const userDataString = Cookies.get("user_data");
    if (userDataString) {
      try {
        const userData = JSON.parse(decodeURIComponent(userDataString));
        setUserId(userData.id);
      } catch (error) {
        console.error("❌ خطأ في تحليل بيانات user_data:", error);
      }
    }
  }, []);

  // الاستماع إلى القناة
  useEffect(() => {
    if (!userId) return;

    console.log(`✅ الاشتراك في القناة TaxiMovement.${userId}`);
    const echo = getEchoInstance();
    if (echo) {
      const channel = echo.channel(`TaxiMovement.${userId}`);
      channel.listen(".requestingTransportationService", (event: any) => {
        console.log("📌 طلب جديد وصل:", event);

        // تشغيل صوت الإشعار
        const audio = new Audio("/notification.mp3");
        audio.play();

        // إظهار الإشعار
        setNotificationMessage(
          `طلب جديد من ${event.customer}: ${event.customer_address} → ${event.destination_address}`
        );
        setNotificationOpen(true);

        // تحديث البيانات
        refetch();
      });

      return () => {
        echo.leaveChannel(`TaxiMovement.${userId}`);
      };
    }
  }, [userId, refetch]);

  // إغلاق الإشعار
  const handleCloseNotification = () => {
    setNotificationOpen(false);
  };

  // عند تحديد طلب معين من الـ URL
  useEffect(() => {
    if (selectedItemId && GlobalData?.data?.length) {
      const foundOrder = GlobalData.data.find((order: any) => order.id === selectedItemId);
      if (foundOrder) {
        console.log("✅ الطلب المحدد:", foundOrder);
        setSelectedOrder(foundOrder);
        setCustomerLocation({
          lat: parseFloat(foundOrder.start_latitude),
          lng: parseFloat(foundOrder.start_longitude),
        });
        setCustomerInfo({
          address: foundOrder.customer_address,
          destination: foundOrder.destination_address,
        });
        setMapCenter({
          lat: parseFloat(foundOrder.start_latitude),
          lng: parseFloat(foundOrder.start_longitude),
        });
      } else {
        console.warn("🚨 لم يتم العثور على الطلب المحدد في البيانات.");
      }
    }
  }, [selectedItemId, GlobalData]);

  return (
    <>
      {/* إشعار التنبيه عند استقبال طلب جديد */}
      <Snackbar open={notificationOpen} autoHideDuration={6000} onClose={handleCloseNotification}>
        <Alert onClose={handleCloseNotification} severity="info" sx={{ width: "100%" }}>
          {notificationMessage}
        </Alert>
      </Snackbar>

      <Grid container spacing={2} sx={{ direction: "rtl", height: "100vh" }}>
        {/* قسم الطلبات */}
        <Grid item xs={3}>
          <TabDynamis routesData={GlobalData?.data ?? []} isLoading={isLoading} higthTab={79} />
        </Grid>

        {/* الخريطة */}
        <Grid item xs={9}>
          <LoadScript googleMapsApiKey={googleMapsApiKey}>
            <GoogleMap mapContainerStyle={mapContainerStyle} zoom={10} center={mapCenter}>
              {customerLocation && (
                <Marker position={customerLocation}>
                  {customerInfo && (
                    <InfoWindow position={customerLocation}>
                      <div style={{ fontSize: "14px", fontWeight: "bold", textAlign: "center" }}>
                        📍 {customerInfo.address} → 🎯 {customerInfo.destination}
                      </div>
                    </InfoWindow>
                  )}
                </Marker>
              )}
            </GoogleMap>
          </LoadScript>

          {selectedItemId ? (
            <Grid item xs={12}>
              <Requests selectedOrder={selectedOrder} />
            </Grid>
          ) : (
            <>
              <Box>
                <Skeleton variant="text" height={40} width="50%" />
                <Skeleton variant="text" height={20} width="80%" />
                <Typography variant="h6" fontWeight="bold">
                  اذكر الله واستعن به على رزقك , بانتظار طلبات الزبائن
                </Typography>
                <Skeleton variant="text" height={20} width="80%" />
                <Box display="flex" justifyContent="space-between" mt={2}>
                  <Skeleton variant="rectangular" width={120} height={40} />
                  <Skeleton variant="rectangular" width={120} height={40} />
                </Box>
              </Box>
            </>
          )}
        </Grid>
      </Grid>
    </>
  );
}