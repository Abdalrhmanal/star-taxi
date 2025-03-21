"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, Divider, Grid, Typography } from "@mui/material";
import { GoogleMap, useLoadScript, Marker, DirectionsRenderer } from "@react-google-maps/api";
import getEchoInstance from "@/reverb";

const googleMapsApiKey = "AIzaSyC4V8cI_ozB1LTeJwjpwmhhyUC_iBrA2FY";

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
  const mapRef = useRef<google.maps.Map | null>(null);
  const lastCalculationRef = useRef<number>(0);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: googleMapsApiKey,
    libraries: libraries as any,
  });

  const driverId = data?.driver_id;
  const startLocation = {
    lat: data?.start_latitude,
    lng: data?.start_longitude,
  };

  const destinationLocation = {
    lat: data?.destination_latitude,
    lng: data?.destination_longitude,
  };

  // Function to calculate route using Google Directions service
  const calculateRoute = useCallback(async () => {
    if (!directionsService.current || !taxiLocation) return;
    
    // Throttle calculations to avoid hitting API limits (no more than once every 2 seconds)
    const now = Date.now();
    if (now - lastCalculationRef.current < 2000) return;
    lastCalculationRef.current = now;

    try {
      console.log("🗺️ Calculating new route...");
      
      // Always use the start location as the origin
      const origin = startLocation;
      
      // Use taxi's current location as an intermediate waypoint
      const currentWaypoint = {
        location: new google.maps.LatLng(taxiLocation.lat, taxiLocation.lng),
        stopover: false
      };
      
      // Always use the destination as the final point
      const destination = destinationLocation;
      
      // Create waypoints from collected path, but limit to avoid API restrictions
      let waypoints = [];
      
      // Add taxi's current location as a waypoint
      waypoints.push(currentWaypoint);
      
      // Add some historical points if available (max 8 points to stay under the 10 waypoint limit)
      if (pathCoordinates.length > 3) {
        // Get a subset of the path to use as waypoints
        const step = Math.max(1, Math.floor(pathCoordinates.length / 8));
        for (let i = 0; i < pathCoordinates.length; i += step) {
          if (waypoints.length < 8) {
            const point = pathCoordinates[i];
            waypoints.push({
              location: new google.maps.LatLng(point.lat, point.lng),
              stopover: false
            });
          }
        }
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
      
      // Fit the map to show the entire route
      if (mapRef.current && result.routes[0]) {
        const bounds = new google.maps.LatLngBounds();
        result.routes[0].legs.forEach(leg => {
          leg.steps.forEach(step => {
            step.path.forEach(point => {
              bounds.extend(point);
            });
          });
        });
        mapRef.current.fitBounds(bounds);
      }
      
    } catch (error) {
      console.error("Failed to calculate route:", error);
    }
  }, [taxiLocation, startLocation, destinationLocation, pathCoordinates]);

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
  }, [data]);

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

  // Calculate route whenever taxi location changes
  useEffect(() => {
    if (isLoaded && directionsService.current && taxiLocation && destinationLocation) {
      calculateRoute();
    }
  }, [taxiLocation, isLoaded, calculateRoute, destinationLocation]);

  // Initial route calculation when component loads
  useEffect(() => {
    if (isLoaded && directionsService.current && startLocation && destinationLocation) {
      // Calculate initial route from start to destination
      const initialRoute = async () => {
        try {
          const result = await new Promise<google.maps.DirectionsResult>((resolve, reject) => {
            directionsService.current?.route(
              {
                origin: new google.maps.LatLng(startLocation.lat, startLocation.lng),
                destination: new google.maps.LatLng(destinationLocation.lat, destinationLocation.lng),
                travelMode: google.maps.TravelMode.DRIVING,
              },
              (result, status) => {
                if (status === google.maps.DirectionsStatus.OK) {
                  resolve(result as google.maps.DirectionsResult);
                } else {
                  console.error(`Error calculating initial route: ${status}`);
                  reject(status);
                }
              }
            );
          });
          
          setDirections(result);
        } catch (error) {
          console.error("Failed to calculate initial route:", error);
        }
      };
      
      initialRoute();
    }
  }, [isLoaded, startLocation, destinationLocation]);

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
          onLoad={(map) => {
            mapRef.current = map;
          }}
        >
          {/* Render directions on the map */}
          {directions && (
            <DirectionsRenderer
              directions={directions}
              options={{
                polylineOptions: {
                  strokeColor: "#0066FF",
                  strokeOpacity: 0.8,
                  strokeWeight: 6,
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
              scaledSize: new google.maps.Size(40, 40),
            }}
          />
          
          {/* Destination marker */}
          {destinationLocation && (
            <Marker 
              position={destinationLocation}
              icon={{
                url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
                scaledSize: new google.maps.Size(40, 40),
              }}
              label={{
                text: "B",
                color: "white",
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