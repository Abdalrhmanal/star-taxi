"use client";

import React, { useState, useEffect } from "react";
import { Grid, Typography, Box } from "@mui/material";
import { GoogleMap, LoadScript, Marker, Polyline } from "@react-google-maps/api";
import getEchoInstance from "@/reverb";

const googleMapsApiKey = "AIzaSyCz7MVXwh_VtjqnPh5auan0QCVwVce2JX0";

const mapContainerStyle = {
  width: "100%",
  height: "100vh",
};

const defaultCenter = {
  lat: 34.8021,
  lng: 38.9968,
};

function MovmentLive({ data }: any) {
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [pathCoordinates, setPathCoordinates] = useState<{ lat: number; lng: number }[]>([]);
  const [taxiLocation, setTaxiLocation] = useState<{ lat: number; lng: number } | null>(null);

  const driverId = data?.driver_id;

  // تحويل المسار المبدئي إلى مصفوفة نقاط
  useEffect(() => {
    if (data?.path?.length) {
      const formattedPath = data.path.map((point: { longitude: number; latitude: number }) => ({
        lat: point.latitude,
        lng: point.longitude,
      }));

      setPathCoordinates(formattedPath);

      // تحديث مركز الخريطة إلى نقطة البداية
      if (formattedPath.length > 0) {
        setMapCenter(formattedPath[0]);
      }
    }
  }, [data]);

  // الاستماع إلى تحديثات موقع السائق عبر `Reverb`
  useEffect(() => {
    if (!driverId) return;

    console.log(`✅ الاشتراك في قناة TaxiLocation.${driverId}`);

    const echo = getEchoInstance();
    if (echo) {
      const channel = echo.channel(`TaxiLocation.${driverId}`);

      channel.listen(".TaxiLocation", (event: any) => {
        console.log("🚖 موقع التاكسي تم تحديثه:", event);

        if (event.longitude && event.latitude) {
          const newTaxiLocation = {
            lat: event.latitude,
            lng: event.longitude,
          };

          setTaxiLocation(newTaxiLocation);

          // تحديث المسار بإضافة الموقع الجديد
          setPathCoordinates((prevPath) => [...prevPath, newTaxiLocation]);

          // تحديث مركز الخريطة لمتابعة التاكسي
          setMapCenter(newTaxiLocation);
        }
      });

      return () => {
        echo.leaveChannel(`TaxiLocation.${driverId}`);
      };
    }
  }, [driverId]);

  return (
    <Grid container spacing={2} sx={{ direction: "rtl", height: "100vh" }}>
      {/* معلومات الرحلة */}
      <Grid item xs={3} sx={{ padding: 2, background: "#f5f5f5" }}>
        <Typography variant="h6">🚖 تفاصيل الرحلة</Typography>
        <Typography>📍 من: {data?.start_address}</Typography>
        <Typography>🎯 إلى: {data?.destination_address}</Typography>
        <Typography>👤 السائق: {data?.driver_name}</Typography>
        <Typography>📞 هاتف السائق: {data?.driver_phone}</Typography>
        <Typography>👥 العميل: {data?.customer_name}</Typography>
        <Typography>📞 هاتف العميل: {data?.customer_phone}</Typography>
        <Typography>🚘 السيارة: {data?.car_name} ({data?.car_plate_number})</Typography>
        <Typography>💰 السعر: {data?.price} دينار</Typography>
        <Typography>📆 التاريخ: {new Date(data?.date).toLocaleString()}</Typography>
      </Grid>

      {/* خريطة جوجل */}
      <Grid item xs={9}>
        <LoadScript googleMapsApiKey={googleMapsApiKey}>
          <GoogleMap mapContainerStyle={mapContainerStyle} zoom={15} center={mapCenter}>
            {/* مسار الحركة */}
            {pathCoordinates.length > 1 && (
              <Polyline
                path={pathCoordinates}
                options={{
                  strokeColor: "#FF0000",
                  strokeOpacity: 0.8,
                  strokeWeight: 4,
                }}
              />
            )}

            {/* نقطة البداية */}
            {pathCoordinates.length > 0 && (
              <Marker position={pathCoordinates[0]} label="A" />
            )}

            {/* أحدث نقطة وصل إليها السائق */}
            {taxiLocation && (
              <Marker position={taxiLocation} label="🚖" />
            )}
          </GoogleMap>
        </LoadScript>
      </Grid>
    </Grid>
  );
}

export default MovmentLive;
