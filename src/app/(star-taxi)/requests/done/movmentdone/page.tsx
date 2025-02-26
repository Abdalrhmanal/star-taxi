"use client";

import React, { useState, useEffect } from "react";
import { Grid, Typography, Box, Card, CardContent, CardHeader, Divider } from "@mui/material";
import { GoogleMap, LoadScript, Marker, Polyline } from "@react-google-maps/api";

const googleMapsApiKey = "AIzaSyCz7MVXwh_VtjqnPh5auan0QCVwVce2JX0";

const mapContainerStyle = {
  width: "100%",
  height: "100vh",
};

const defaultCenter = {
  lat: 34.8021,
  lng: 38.9968,
};

function MovmentDone({ data }: any) {
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [pathCoordinates, setPathCoordinates] = useState<{ lat: number; lng: number }[]>([]);

  // تحويل `path` إلى إحداثيات للخريطة
  useEffect(() => {
    if (data?.path?.length) {
      const formattedPath = data.path.map((point: { longitude: number; latitude: number }) => ({
        lat: point.latitude,
        lng: point.longitude,
      }));

      setPathCoordinates(formattedPath);

      // تحديث مركز الخريطة ليكون في منتصف المسار
      if (formattedPath.length > 0) {
        setMapCenter(formattedPath[Math.floor(formattedPath.length / 2)]);
      }
    }
  }, [data]);

  return (
    <Grid container spacing={2} sx={{ direction: "rtl", height: "100vh" }}>
      {/* معلومات الرحلة */}
      <Grid item xs={3} sx={{ padding: 2, background: "#f5f5f5" }}>
        <Card>
          <CardHeader title="🚖 تفاصيل الرحلة" />
          <CardContent>
            <Typography variant="body1"><strong>📍 من:</strong> {data?.start_address}</Typography>
            <Divider sx={{ my: 1 }} />
            <Typography variant="body1"><strong>🎯 إلى:</strong> {data?.destination_address}</Typography>
            <Divider sx={{ my: 1 }} />
            <Typography variant="body1"><strong>👤 السائق:</strong> {data?.driver_name}</Typography>
            <Divider sx={{ my: 1 }} />
            <Typography variant="body1"><strong>📞 هاتف السائق:</strong> {data?.driver_phone}</Typography>
            <Divider sx={{ my: 1 }} />
            <Typography variant="body1"><strong>👥 العميل:</strong> {data?.customer_name}</Typography>
            <Divider sx={{ my: 1 }} />
            <Typography variant="body1"><strong>📞 هاتف العميل:</strong> {data?.customer_phone}</Typography>
            <Divider sx={{ my: 1 }} />
            <Typography variant="body1"><strong>🚘 السيارة:</strong> {data?.car_name} ({data?.car_plate_number})</Typography>
            <Divider sx={{ my: 1 }} />
            <Typography variant="body1"><strong>💰 السعر:</strong> {data?.price} {data?.coin}</Typography>
            <Divider sx={{ my: 1 }} />
            <Typography variant="body1"><strong>📆 التاريخ:</strong> {new Date(data?.date).toLocaleString()}</Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* خريطة جوجل */}
      <Grid item xs={9}>
        <LoadScript googleMapsApiKey={googleMapsApiKey}>
          <GoogleMap mapContainerStyle={mapContainerStyle} zoom={12} center={mapCenter}>
            {/* مسار الرحلة */}
            {pathCoordinates.length > 1 && (
              <Polyline
                path={pathCoordinates}
                options={{
                  strokeColor: "#00AA00",
                  strokeOpacity: 0.8,
                  strokeWeight: 4,
                }}
              />
            )}

            {/* نقطة البداية */}
            {pathCoordinates.length > 0 && (
              <Marker position={pathCoordinates[0]} label="A" />
            )}

            {/* نقطة النهاية */}
            {pathCoordinates.length > 1 && (
              <Marker position={pathCoordinates[pathCoordinates.length - 1]} label="B" />
            )}
          </GoogleMap>
        </LoadScript>
      </Grid>
    </Grid>
  );
}

export default MovmentDone;