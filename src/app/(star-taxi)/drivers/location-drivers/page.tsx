"use client";
import useGlobalData from "@/hooks/get-global";
import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import getEchoInstance from "@/reverb";

interface DriverData {
  driver_id: number;
  driver_name: string;
  driver_avatar: string;
  lat: number | string; // ✅ السماح بأن يكون `lat` و `long` نصوص لتجنب الأخطاء الأولية
  long: number | string;
  path?: string;
}

interface GlobalDataType {
  data: DriverData[];
  pagination?: {
    totalCount: number;
  };
}

const LoctionDrivers = () => {
  const googleMapsApiKey = "AIzaSyCz7MVXwh_VtjqnPh5auan0QCVwVce2JX0";

  const mapContainerStyle = {
    width: "100%",
    height: "87vh",
  };

  const center = {
    lat: 34.8021, // مركز الخريطة في سوريا
    lng: 38.9968,
  };

  // ✅ حالة لحفظ بيانات السائقين وتحديث مواقعهم ديناميكيًا
  const [drivers, setDrivers] = useState<DriverData[]>([]);

  const GoogleMapComponent = () => {
    return (
      <LoadScript googleMapsApiKey={googleMapsApiKey}>
        <GoogleMap mapContainerStyle={mapContainerStyle} zoom={6} center={center}>
          {drivers.map((driver) => {
            // ✅ التحقق من صحة البيانات قبل عرض الـ Marker
            const lat = parseFloat(String(driver.lat));
            const lng = parseFloat(String(driver.long));

            if (isNaN(lat) || isNaN(lng)) {
              console.warn(`🚨 بيانات غير صالحة لموقع السائق:`, driver);
              return null;
            }

            return (
              <Marker
                key={driver.driver_id}
                position={{ lat, lng }}
                title={driver.driver_name}
              />
            );
          })}
        </GoogleMap>
      </LoadScript>
    );
  };

  const dataSourceName = "api/drivers";
  const { data: GlobalData } = useGlobalData<GlobalDataType | any>({
    dataSourceName,
    enabled: true,
    setOldDataAsPlaceholder: true,
  });

  useEffect(() => {
    if (!GlobalData?.data) return;

    const validDrivers = GlobalData.data
      .map((driver: DriverData) => ({
        ...driver,
        lat: parseFloat(String(driver.lat)),
        long: parseFloat(String(driver.long)),
      }))
      .filter((driver: DriverData) => !isNaN(parseFloat(String(driver.lat))) && !isNaN(parseFloat(String(driver.long))));

    setDrivers(validDrivers);

    const echo = getEchoInstance(); 

    GlobalData?.data.forEach((driver: DriverData) => {
      if (echo) {
        echo.channel(`TaxiLocation.${driver.driver_id}`)
          .listen(".TaxiLocation", (event: DriverData) => {
            console.log("📌 Location updated:", event);

            const lat = parseFloat(String(event.lat));
            const long = parseFloat(String(event.long));

            if (isNaN(lat) || isNaN(long)) {
              console.warn(`🚨 إحداثيات غير صالحة لتحديث السائق:`, event);
              return;
            }

            setDrivers((prevDrivers) =>
              prevDrivers.map((d) =>
                d.driver_id === event.driver_id
                  ? { ...d, lat, long } 
                  : d
              )
            );
          })
          .error((error: any) => {
            console.error("❌ Error listening to channel:", error);
          });
      } else {
        console.error("❌ Echo is not defined on window");
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
    <>
      <GoogleMapComponent />
    </>
  );
};

export default LoctionDrivers;
