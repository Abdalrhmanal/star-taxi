"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Grid, Typography, Box, Card, CardContent, CardHeader, Divider } from "@mui/material";
import { GoogleMap, useLoadScript, Marker, DirectionsRenderer } from "@react-google-maps/api";

const googleMapsApiKey = "AIzaSyC4V8cI_ozB1LTeJwjpwmhhyUC_iBrA2FY";

const mapContainerStyle = {
  width: "100%",
  height: "100vh",
};

const defaultCenter = {
  lat: 34.8021,
  lng: 38.9968,
};

const libraries = ["places", "directions"];

function MovmentDone({ data }: any) {
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [pathCoordinates, setPathCoordinates] = useState<{ lat: number; lng: number }[]>([]);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const directionsService = useRef<google.maps.DirectionsService | null>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: googleMapsApiKey,
    libraries: libraries as any,
  });

  // Initialize directions service when map is loaded
  useEffect(() => {
    if (isLoaded && !directionsService.current) {
      directionsService.current = new google.maps.DirectionsService();
    }
  }, [isLoaded]);

  // Convert path to coordinates for the map
  useEffect(() => {
    if (data?.path?.length) {
      const formattedPath = data.path.map((point: { longitude: number; latitude: number }) => ({
        lat: point.latitude,
        lng: point.longitude,
      }));

      setPathCoordinates(formattedPath);

      // Update map center to be in the middle of the path
      if (formattedPath.length > 0) {
        setMapCenter(formattedPath[Math.floor(formattedPath.length / 2)]);
      }
    }
  }, [data]);

  // Function to calculate route using Google Directions service
  const calculateRoute = useCallback(async () => {
    if (!directionsService.current || pathCoordinates.length < 2) return;

    try {
      // Create waypoints from all points except first and last
      // Limit waypoints to 23 (Google Maps API limit is 25 including origin and destination)
      const allPoints = [...pathCoordinates];
      const origin = allPoints[0];
      const destination = allPoints[allPoints.length - 1];
      
      // Take at most 23 waypoints, evenly distributed
      let waypoints = [];
      if (allPoints.length > 25) {
        const step = Math.floor(allPoints.length / 23);
        for (let i = 1; i < allPoints.length - 1; i += step) {
          if (waypoints.length < 23) {
            waypoints.push({
              location: new google.maps.LatLng(allPoints[i].lat, allPoints[i].lng),
              stopover: false
            });
          }
        }
      } else {
        waypoints = allPoints.slice(1, -1).map(point => ({
          location: new google.maps.LatLng(point.lat, point.lng),
          stopover: false
        }));
      }

      const result = await new Promise<google.maps.DirectionsResult>((resolve, reject) => {
        directionsService.current?.route(
          {
            origin: new google.maps.LatLng(origin.lat, origin.lng),
            destination: new google.maps.LatLng(destination.lat, destination.lng),
            waypoints: waypoints,
            optimizeWaypoints: false,
            travelMode: google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
              resolve(result as google.maps.DirectionsResult);
            } else {
              console.error(`Error calculating route: ${status}`);
              reject(status);
            }
          }
        );
      });

      setDirections(result);
    } catch (error) {
      console.error("Failed to calculate route:", error);
    }
  }, [pathCoordinates]);

  // Calculate route when path coordinates are available
  useEffect(() => {
    if (pathCoordinates.length >= 2 && isLoaded && directionsService.current) {
      calculateRoute();
    }
  }, [pathCoordinates, isLoaded, calculateRoute]);

  if (loadError) {
    return <Typography variant="h6" color="error">❌ حدث خطأ أثناء تحميل الخريطة</Typography>;
  }

  if (!isLoaded) {
    return <Typography variant="h6">⏳ جارٍ تحميل الخريطة...</Typography>;
  }

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
        <GoogleMap 
          mapContainerStyle={mapContainerStyle} 
          zoom={12} 
          center={mapCenter}
          options={{
            zoomControl: true,
            mapTypeControl: true,
            fullscreenControl: true,
            streetViewControl: true,
          }}
        >
          {/* Render directions on the map */}
          {directions && (
            <DirectionsRenderer
              directions={directions}
              options={{
                polylineOptions: {
                  strokeColor: "#00AA00",
                  strokeOpacity: 0.8,
                  strokeWeight: 5,
                },
                suppressMarkers: true, // We'll add our own markers
              }}
            />
          )}

          {/* نقطة البداية */}
          {pathCoordinates.length > 0 && (
            <Marker 
              position={pathCoordinates[0]} 
              label={{
                text: "A",
                color: "white",
                fontWeight: "bold"
              }}
              icon={{
                url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
                labelOrigin: new google.maps.Point(15, 10),
              }}
            />
          )}

          {/* نقطة النهاية */}
          {pathCoordinates.length > 1 && (
            <Marker 
              position={pathCoordinates[pathCoordinates.length - 1]} 
              label={{
                text: "B",
                color: "black",
                fontWeight: "bold"
              }}
              icon={{
                url: "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
                labelOrigin: new google.maps.Point(15, 10),
              }}
            />
          )}
        </GoogleMap>
      </Grid>
    </Grid>
  );
}

export default MovmentDone;