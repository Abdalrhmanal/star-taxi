"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
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

function Home({ adminId, onSuccess }: { adminId: string; onSuccess?: () => void }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedItemId = searchParams.get("selectedItemId");

  console.log("adminId : ", adminId);

  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
  }>({ open: false, message: "" });
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  // جلب بيانات الطلبات
  const { data: GlobalData, isLoading: GlobalLoading, refetch } =
    useGlobalData<any>({
      dataSourceName: "api/taxi-movement",
      enabled: true,
      setOldDataAsPlaceholder: true,
    });

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
      if (!adminId) return;

      const echo = getEchoInstance();
      if (!echo) return;

      console.log(`✅ الاشتراك في القناة ${channelName}.${adminId}`);
      const channel = echo.channel(`${channelName}.${adminId}`);
      channel.listen(eventName, (event: any) => {
        console.log(`📌 حدث جديد (${eventName}):`, event);
        playNotificationSound();
        callback(event);
      });

      return () => {
        echo.leaveChannel(`${channelName}.${adminId}`);
      };
    },
    [adminId, playNotificationSound]
  );

  // إعدادات القنوات والإشعارات
  useEffect(() => {
    if (!adminId) return;

    const unsubscribers = [
      subscribeToChannel(
        "TaxiMovement",
        ".requestingTransportationService",
        (event) => {
          setNotification({
            open: true,
            message: `طلب جديد من ${event.customer}: الموقع الحالي: ${event.customer_address} الوجهة إلى → ${event.destination_address}`,
          });
          setNotificationMessage(
            `طلب جديد من الزبون ${event.customer}: الموقع الحالي ${event.customer_address} الوجهة إلى → ${event.destination_address}`
          );
          setNotificationOpen(true);
          refetch();
        }
      ),
      subscribeToChannel("foundCustomer", ".foundCustomer", (event) => {
        setNotification({
          open: true,
          message: `السائق ${event.driverName} وجد الزبون ${event.customerName} → ${event.message}`,
        });
        setNotificationMessage(`السائق ${event.driverName} وجد الزبون ${event.customerName} → ${event.message}`);
        setNotificationOpen(true);
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
          setNotificationMessage(`السائق ${event.driver.name} أكمل طلب الزبون ${event.customer.name} → ${event.message}`);
          setNotificationOpen(true);
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
          setNotificationMessage(`الزبون ${event.customer.name} برقم جوال ${event.customer.phone_number} ألغى الطلب → ${event.message}`);
          setNotificationOpen(true);
          refetch();
        }
      ),
    ];

    return () =>
      unsubscribers.forEach((unsubscribe) => unsubscribe && unsubscribe());
  }, [adminId, refetch, subscribeToChannel]);

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

  // إغلاق الإشعار
  const handleCloseNotification = () => {
    setNotificationOpen(false);
  };

  return (
    <>
      <Snackbar
        open={notificationOpen}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1301 }}
      >
        <Alert onClose={handleCloseNotification} severity="info" sx={{ width: "100%", direction: "rtl" }}>
          {notificationMessage || notification.message}
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
            {selectedItemId && selectedOrder ? (
              <Requests selectedOrder={selectedOrder} onSuccess={() => { refetch(); if (onSuccess) onSuccess(); }} />
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