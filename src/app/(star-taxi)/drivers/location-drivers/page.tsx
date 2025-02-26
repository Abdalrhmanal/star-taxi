"use client";
import useGlobalData from "@/hooks/get-global";
import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import getEchoInstance from "@/reverb";

interface DriverData {
  driver_id: number;
  driver_name: string;
  driver_avatar: string;
  lat: number | string;
  long: number | string;
  path?: string; 
}

interface GlobalDataType {
  data: DriverData[];
  name?: string; // اسم السائق من GlobalData
}

const LoctionDrivers = () => {
  const googleMapsApiKey = "AIzaSyCz7MVXwh_VtjqnPh5auan0QCVwVce2JX0" ;

  const mapContainerStyle = {
    width: "100%",
    height: "87vh",
  };

  const center = {
    lat: 34.8021,
    lng: 38.9968,
  };

  const [drivers, setDrivers] = useState<DriverData[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<DriverData | null>(null);

  const { data: GlobalData } = useGlobalData<GlobalDataType>({
    dataSourceName: "api/drivers",
    enabled: true,
    setOldDataAsPlaceholder: true,
  });

  useEffect(() => {
    if (!GlobalData?.data) return;

    const extractLatestLocation = (driver: DriverData) => {
      let lat = parseFloat(String(driver.lat));
      let long = parseFloat(String(driver.long));

      if (driver.path) {
        try {
          const pathArray = JSON.parse(driver.path);
          if (Array.isArray(pathArray) && pathArray.length > 0) {
            const latestPoint = pathArray[pathArray.length - 1];
            lat = parseFloat(String(latestPoint.lat)) || lat;
            long = parseFloat(String(latestPoint.long)) || long;
          }
        } catch (error) {
          console.error("❌ فشل تحليل مسار السائق:", driver.path);
        }
      }

      return { ...driver, lat, long };
    };

    const validDrivers = GlobalData.data
      .map(extractLatestLocation)
      .filter((driver) => !isNaN(driver.lat) && !isNaN(driver.long));

    setDrivers(validDrivers);

    const echo = getEchoInstance();

    GlobalData?.data.forEach((driver: DriverData) => {
      if (echo) {
        echo.channel(`TaxiLocation.${driver.driver_id}`)
          .listen(".TaxiLocation", (event: DriverData) => {
            const lat = parseFloat(String(event.lat));
            const long = parseFloat(String(event.long));

            if (isNaN(lat) || isNaN(long)) return;

            setDrivers((prevDrivers) =>
              prevDrivers.map((d) =>
                d.driver_id === event.driver_id ? { ...d, lat, long } : d
              )
            );
          })
          .error((error: any) => {
            console.error("❌ Error listening to channel:", error);
          });
      }
    });

    return () => {
      GlobalData?.data.forEach((driver: DriverData) => {
        if (echo) {
          echo.leaveChannel(`TaxiLocation.${driver.driver_id}`);
        }
      });
    };
  }, [GlobalData]);

  return (
    <LoadScript googleMapsApiKey={googleMapsApiKey}>
      <GoogleMap mapContainerStyle={mapContainerStyle} zoom={6} center={center}>
        {drivers.map((driver) => (
          <Marker
            key={driver.driver_id}
            position={{ lat: parseFloat(String(driver.lat)), lng: parseFloat(String(driver.long)) }}
            title={driver.driver_name}
            onClick={() => setSelectedDriver(driver)}
          />
        ))}

        {selectedDriver && (
          <InfoWindow
            position={{
              lat: parseFloat(String(selectedDriver.lat)),
              lng: parseFloat(String(selectedDriver.long)),
            }}
            onCloseClick={() => setSelectedDriver(null)}
          >
            <div>
              <h3>{selectedDriver.driver_name}</h3>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default LoctionDrivers;
