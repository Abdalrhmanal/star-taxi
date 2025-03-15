"use client";
import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { Box } from "@mui/material";
import getEchoInstance from "@/reverb";

// تعريف نوع البيانات القادمة من القناة
interface DriverLocation {
  driver_id: string;
  driver_name: string;
  driver_avatar: string;
  lat: number;
  long: number;
  phone_number: string;
  plate_number: string;
  lamp_number: string;
}

const MapComponent = ({ data }: any) => {
  const driverId = data.driver_id;
  const [driverMarker, setDriverMarker] = useState<DriverLocation | null>(null);
  const googleMapsApiKey = "AIzaSyC4V8cI_ozB1LTeJwjpwmhhyUC_iBrA2FY";
  const mapContainerStyle = {
    width: "100%",
    height: "87vh",
  };
  const defaultCenter = {
    lat: 34.8021,
    lng: 38.9968,
  };

  useEffect(() => {
    const echo = getEchoInstance();
    echo.channel(`TaxiLocation.${driverId}`).listen(
      ".TaxiLocation",
      (event: any) => {
        const lat = parseFloat(String(event.lat));
        const long = parseFloat(String(event.long));
        const nameDr = event.driver_name;
        const driverAvatar = event.driver_avatar;
        const phoneNumber = event.phone_number;
        const plateNumber = event.plate_number;
        const lampNumber = event.lamp_number;

        if (isNaN(lat) || isNaN(long)) return;

        setDriverMarker({
          driver_id: driverId,
          driver_name: nameDr,
          driver_avatar: driverAvatar,
          lat,
          long,
          phone_number: phoneNumber,
          plate_number: plateNumber,
          lamp_number: lampNumber,
        });
      }
    );

    // تنظيف المستمعين عند فك التثبيت
    return () => {
      if (echo) {
        echo.leaveChannel(`TaxiLocation.${driverId}`);
      }
    };
  }, [driverId]);

  return (
    <Box>
      <LoadScript googleMapsApiKey={googleMapsApiKey}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={driverMarker ? { lat: driverMarker.lat, lng: driverMarker.long } : defaultCenter}
          zoom={15} // تكبير الخريطة للتركيز على السائق
        >
          {driverMarker && (
            <Marker
              position={{ lat: driverMarker.lat, lng: driverMarker.long }}
              title={driverMarker.driver_name}
              icon={{
                url: `https://tawsella.online${driverMarker.driver_avatar}` || "/default-avatar.png", // صورة السائق
                scaledSize: new window.google.maps.Size(40, 40),
              }}
            >
              <InfoWindow position={{ lat: driverMarker.lat, lng: driverMarker.long }}>
                <div>
                  <h3>{driverMarker.driver_name}</h3>
                  <p>Phone: {data.phone_number}</p>
                  <p>Plate Number: {data.plate_number}</p>
                  <p>Lamp Number: {data.lamp_number}</p>
                </div>
              </InfoWindow>
            </Marker>
          )}
        </GoogleMap>
      </LoadScript>
    </Box>
  );
};

export default MapComponent;