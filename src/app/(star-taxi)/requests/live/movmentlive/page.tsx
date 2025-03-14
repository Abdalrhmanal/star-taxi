"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, Divider, Grid, Typography } from "@mui/material";
import { GoogleMap, useLoadScript, Marker, DirectionsRenderer } from "@react-google-maps/api";
import getEchoInstance from "@/reverb";

const googleMapsApiKey = "AIzaSyCz7MVXwh_VtjqnPh5auan0QCVwVce2JX0";

const mapContainerStyle = {
  width: "100%",
  height: "100vh",
};

const libraries = ["places", "directions"];

function MovmentLive({ data }: any) {
  const [pathCoordinates, setPathCoordinates] = useState<{ lat: number; lng: number }[]>([]);
  const [taxiLocation, setTaxiLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const directionsService = useRef<google.maps.DirectionsService | null>(null);
  const pathUpdatedRef = useRef(false);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: googleMapsApiKey,
    libraries: libraries as any,
  });

  const driverId = data?.driver_id;
  const startLocation = {
    lat: data?.start_latitude,
    lng: data?.start_longitude,
  };

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

  // Initialize directions service when map is loaded
  useEffect(() => {
    if (isLoaded && !directionsService.current) {
      directionsService.current = new google.maps.DirectionsService();
    }
  }, [isLoaded]);

  // Update path coordinates from initial data
  useEffect(() => {
    if (!data) return;
    
    // Only update path if we have valid data
    if (startLocation.lat && startLocation.lng) {
      if (data?.path?.length) {
        const formattedPath = data.path.map((point: { longitude: number; latitude: number }) => ({
          lat: point.latitude,
          lng: point.longitude,
        }));

        setPathCoordinates([startLocation, ...formattedPath]);
      } else {
        setPathCoordinates([startLocation]);
      }
    }
  }, [data]); // Remove startLocation from dependencies to avoid loops

  // Listen for real-time taxi location updates
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
          
          // Add the new location to path coordinates
          setPathCoordinates(prevPath => {
            // Only add if it's different from the last point
            const lastPoint = prevPath[prevPath.length - 1];
            if (lastPoint && 
                lastPoint.lat === newLocation.lat && 
                lastPoint.lng === newLocation.lng) {
              return prevPath;
            }
            return [...prevPath, newLocation];
          });
        }
      });

      return () => {
        echo.leaveChannel(`TaxiLocation.${driverId}`);
      };
    }
  }, [driverId]);

  // Calculate route whenever path coordinates change
  useEffect(() => {
    if (pathCoordinates.length >= 2 && isLoaded && directionsService.current) {
      // Use a ref to track if we need to calculate route
      if (!pathUpdatedRef.current) {
        pathUpdatedRef.current = true;
        // Use setTimeout to break the potential update cycle
        setTimeout(() => {
          calculateRoute();
          pathUpdatedRef.current = false;
        }, 100);
      }
    }
  }, [pathCoordinates, isLoaded, calculateRoute]);

  const endLocation = taxiLocation || (pathCoordinates.length > 1 ? pathCoordinates[pathCoordinates.length - 1] : startLocation);

  if (loadError) {
    return <Typography variant="h6" color="error">❌ حدث خطأ أثناء تحميل الخريطة</Typography>;
  }

  if (!isLoaded) {
    return <Typography variant="h6">⏳ جارٍ تحميل الخريطة...</Typography>;
  }

  return (
    <Grid container spacing={2} sx={{ direction: "rtl", height: "100vh" }}>
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

      <Grid item xs={9}>
        <GoogleMap 
          mapContainerStyle={mapContainerStyle} 
          zoom={15} 
          center={endLocation}
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
                  strokeColor: "#FF0000",
                  strokeOpacity: 0.8,
                  strokeWeight: 5,
                },
                suppressMarkers: true, // We'll add our own markers
              }}
            />
          )}

          {/* Start marker */}
          <Marker 
            position={startLocation} 
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
          
          {/* Last reached point marker (yellow pin) */}
          {endLocation && endLocation !== startLocation && (
            <Marker 
              position={endLocation}
              icon={{
                url: "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
                scaledSize: new google.maps.Size(40, 40),
              }}
              label={{
                text: "B",
                color: "black",
                fontWeight: "bold"
              }}
            />
          )}
          
          {/* Taxi location marker */}
          {taxiLocation && (
            <Marker 
              position={taxiLocation} 
              icon={{
                url: "https://maps.google.com/mapfiles/ms/icons/cabs.png",
                scaledSize: new google.maps.Size(40, 40),
              }}
              animation={google.maps.Animation.BOUNCE}
            />
          )}
        </GoogleMap>
      </Grid>
    </Grid>
  );
}

export default MovmentLive;