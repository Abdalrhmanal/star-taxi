"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Grid,
  Typography,
  Box,
  Snackbar,
  Alert,
  Skeleton,
} from "@mui/material";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { useRouter, useSearchParams } from "next/navigation";
import getEchoInstance from "@/reverb";
import Cookies from "js-cookie";
import TabDynamis from "@/components/Dynamic-Tabs";
import useGlobalData from "@/hooks/get-global";
import Requests from "@/components/requests";

const GOOGLE_MAPS_API_KEY = "AIzaSyCz7MVXwh_VtjqnPh5auan0QCVwVce2JX0";
const MAP_CONTAINER_STYLE = { width: "100%", height: "70vh" };
const DEFAULT_CENTER = { lat: 34.8021, lng: 38.9968 };

function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedItemId = searchParams.get("selectedItemId");

  const [userId, setUserId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
  }>({ open: false, message: "" });
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // جلب بيانات الطلبات
  const { data: GlobalData, isLoading: GlobalLoading, refetch } =
    useGlobalData<any>({
      dataSourceName: "api/taxi-movement",
      enabled: true,
      setOldDataAsPlaceholder: true,
    });

  // استخراج userId من الكوكيز
  useEffect(() => {
    try {
      const userData = Cookies.get("user_data");
      if (userData)
        setUserId(JSON.parse(decodeURIComponent(userData)).id);
    } catch (error) {
      console.error("❌ خطأ في تحليل بيانات user_data:", error);
    }
  }, []);

  // دالة لتشغيل صوت الإشعار
  const playNotificationSound = useCallback(() => {
    new Audio("/notification.mp3").play();
  }, []);

  // دالة الاشتراك في قنوات Reverb
  const subscribeToChannel = useCallback(
    (
      channelName: string,
      eventName: string,
      callback: (event: any) => void
    ) => {
      if (!userId) return;

      const echo = getEchoInstance();
      if (!echo) return;

      console.log(`✅ الاشتراك في القناة ${channelName}.${userId}`);
      const channel = echo.channel(`${channelName}.${userId}`);
      channel.listen(eventName, (event: any) => {
        console.log(`📌 حدث جديد (${eventName}):`, event);
        playNotificationSound();
        callback(event);
      });

      return () => {
        echo.leaveChannel(`${channelName}.${userId}`);
      };
    },
    [userId, playNotificationSound]
  );

  // إعدادات القنوات والإشعارات
  useEffect(() => {
    if (!userId) return;

    const unsubscribers = [
      subscribeToChannel(
        "TaxiMovement",
        ".requestingTransportationService",
        (event) => {
          setNotification({
            open: true,
            message: `طلب جديد من ${event.customer}: ${event.customer_address} → ${event.destination_address}`,
          });
          refetch();
        }
      ),
      subscribeToChannel("foundCustomer", ".foundCustomer", (event) => {
        setNotification({
          open: true,
          message: `السائق ${event.driverName} والزبون ${event.customerName} → ${event.message}`,
        });
        refetch();
      }),
      subscribeToChannel(
        "movementCompleted",
        ".movementCompleted",
        (event) => {
          setNotification({
            open: true,
            message: `السائق ${event.driver.name} أكمل طلب الزبون ${event.customer.name} → ${event.message}`,
          });
          refetch();
        }
      ),
      subscribeToChannel(
        "customerCancelMovement",
        ".customerCancelMovement",
        (event) => {
          setNotification({
            open: true,
            message: `الزبون ${event.customer.name} برقم جوال ${event.customer.phone_number} ألغى الطلب → ${event.message}`,
          });
          refetch();
        }
      ),
    ];

    return () =>
      unsubscribers.forEach((unsubscribe) => unsubscribe && unsubscribe());
  }, [userId, refetch, subscribeToChannel]);

  // عند تحديد طلب معين من الـ URL
  useEffect(() => {
    if (selectedItemId && GlobalData?.data?.length) {
      const foundOrder = GlobalData.data.find(
        (order: any) => order.id === selectedItemId
      );
      if (foundOrder) {
        setSelectedOrder(foundOrder);
        setMapCenter({
          lat: parseFloat(foundOrder.start_latitude),
          lng: parseFloat(foundOrder.start_longitude),
        });
      }
    }
  }, [selectedItemId, GlobalData]);

  return (
    <>
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() =>
          setNotification({ ...notification, open: false })
        }
      >
        <Alert severity="info" sx={{ width: "100%" }}>
          {notification.message}
        </Alert>
      </Snackbar>

      <Grid container spacing={2} sx={{ direction: "rtl" }}>
        <Grid item xs={12} md={3}>
          <TabDynamis
            routesData={GlobalData?.data ?? []}
            isLoading={GlobalLoading}
            higthTab={79}
          />
        </Grid>

        <Grid item xs={12} md={9}>
          <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
            <GoogleMap
              mapContainerStyle={MAP_CONTAINER_STYLE}
              zoom={10}
              center={mapCenter}
            >
              {selectedOrder && (
                <Marker
                  position={{
                    lat: parseFloat(selectedOrder.start_latitude),
                    lng: parseFloat(selectedOrder.start_longitude),
                  }}
                >
                  <InfoWindow
                    position={{
                      lat: parseFloat(selectedOrder.start_latitude),
                      lng: parseFloat(selectedOrder.start_longitude),
                    }}
                  >
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      📍{"الانطلاق من :"} {selectedOrder.start_address}  🎯{"-> الوجهة الى : "} {selectedOrder.destination_address}
                    </div>
                  </InfoWindow>
                </Marker>
              )}
            </GoogleMap>
          </LoadScript>

          <Box p={2}>
            {selectedOrder ? (
              <Requests selectedOrder={selectedOrder} onSuccess={refetch} />
            ) : (
              <>
                <Skeleton variant="text" height={40} width="50%" />
                <Typography variant="h6" fontWeight="bold">
                  اذكر الله واستعن به على رزقك , بانتظار طلبات الزبائن
                </Typography>
                <Skeleton variant="text" height={20} width="80%" />
              </>
            )}
          </Box>
        </Grid>
      </Grid>
    </>
  );
}

export default Home;