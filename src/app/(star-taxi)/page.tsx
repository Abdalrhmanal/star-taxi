"use client";

import React, { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import getEchoInstance from "@/reverb";
import Cookies from "js-cookie";
import TabDynamis from "@/components/Dynamic-Tabs";

const googleMapsApiKey = "AIzaSyCz7MVXwh_VtjqnPh5auan0QCVwVce2JX0";

const mapContainerStyle = {
  width: "100%",
  height: "87vh",
};

const center = {
  lat: 34.8021,
  lng: 38.9968,
};

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [routesData, setRoutesData] = useState<any[]>([]);
  const [customerLocation, setCustomerLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [customerInfo, setCustomerInfo] = useState<{ address: string; destination: string } | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

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
  console.log(userId);

  useEffect(() => {
    if (!userId) return;

    console.log(`✅ الاشتراك في القناة TaxiMovement.${userId}`);

    const echo = getEchoInstance();
    console.log('echo', echo);

    if (echo) {
      const channel = echo.channel(`TaxiMovement.${userId}`);
      console.log('ddd', channel);

      channel
        .listen(".requestingTransportationService", (event: any) => {
          console.log("📌 طلب جديد وصل:", event);
          console.log("📍", event.start_latitude, event.start_longitude);

          setIsLoading(true);

          setCustomerLocation({
            lat: parseFloat(event.start_latitude),
            lng: parseFloat(event.start_longitude),
          });

          setCustomerInfo({
            address: event.customer_address,
            destination: event.destination_address,
          });

          setRoutesData((prevData) => [...prevData, event]);

          setTimeout(() => setIsLoading(false), 1000);
        })
        .error((error: any) => {
          console.error("❌ خطأ أثناء الاستماع للقناة:", error);
        });

      return () => {
        echo.leaveChannel(`TaxiMovement.${userId}`);
      };
    }
  }, [userId]);

  return (
    <>
      <Grid container spacing={2} sx={{ direction: "rtl", height: "87vh" }}>
        <Grid item xs={3}>
          <TabDynamis routesData={routesData} isLoading={isLoading} higthTab={79} />
        </Grid>

        <Grid item xs={9}>
          <LoadScript googleMapsApiKey={googleMapsApiKey}>
            <GoogleMap mapContainerStyle={mapContainerStyle} zoom={6} center={customerLocation || center}>
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
        </Grid>
      </Grid>
    </>
  );
}
