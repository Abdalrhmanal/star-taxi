"use client";

import React, { useState, useEffect } from "react";
import { Grid, Typography } from "@mui/material";
import { GoogleMap, useLoadScript, Marker, Polyline } from "@react-google-maps/api";
import getEchoInstance from "@/reverb";

const googleMapsApiKey = "AIzaSyCz7MVXwh_VtjqnPh5auan0QCVwVce2JX0";

const mapContainerStyle = {
  width: "100%",
  height: "100vh",
};

function MovmentLive({ data }: any) {
  const [pathCoordinates, setPathCoordinates] = useState<{ lat: number; lng: number }[]>([]);
  const [taxiLocation, setTaxiLocation] = useState<{ lat: number; lng: number } | null>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: googleMapsApiKey,
  });

  const driverId = data?.driver_id;
  const startLocation = {
    lat: data?.start_latitude,
    lng: data?.start_longitude,
  };

  useEffect(() => {
    if (data?.path?.length) {
      const formattedPath = data.path.map((point: { longitude: number; latitude: number }) => ({
        lat: point.latitude,
        lng: point.longitude,
      }));

      setPathCoordinates([startLocation, ...formattedPath]);
    } else {
      setPathCoordinates([startLocation]);
    }
  }, [data]);

  useEffect(() => {
    if (!driverId) return;

    console.log(`✅ الاشتراك في قناة TaxiLocation.${driverId}`);

    const echo = getEchoInstance();
    if (echo) {
      const channel = echo.channel(`TaxiLocation.${driverId}`);

      channel.listen(".TaxiLocation", (event: any) => {
        console.log("🚖 موقع التاكسي تم تحديثه:", event);

        if (event.lat && event.long) {
          const newLocation = {
            lat: event.lat,
            lng: event.long,
          };

          setTaxiLocation(newLocation);
          setPathCoordinates((prevPath) => [...prevPath, newLocation]);
        }
      });

      return () => {
        echo.leaveChannel(`TaxiLocation.${driverId}`);
      };
    }
  }, [driverId]);

  const endLocation = pathCoordinates.length > 1 ? pathCoordinates[pathCoordinates.length - 1] : startLocation;

  if (loadError) {
    return <Typography variant="h6" color="error">❌ حدث خطأ أثناء تحميل الخريطة</Typography>;
  }

  if (!isLoaded) {
    return <Typography variant="h6">⏳ جارٍ تحميل الخريطة...</Typography>;
  }

  return (
    <Grid container spacing={2} sx={{ direction: "rtl", height: "100vh" }}>
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

      <Grid item xs={9}>
        <GoogleMap mapContainerStyle={mapContainerStyle} zoom={15} center={endLocation}>
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

          <Marker position={startLocation} label="A" />
          {taxiLocation && <Marker position={taxiLocation} label="🚖" />}
        </GoogleMap>
      </Grid>
    </Grid>
  );
}

export default MovmentLive;
