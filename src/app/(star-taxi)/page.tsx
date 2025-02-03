"use client";

import React from 'react';
import { Grid } from '@mui/material';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import HeaderPage from '@/components/head-page';

const googleMapsApiKey = "AIzaSyCz7MVXwh_VtjqnPh5auan0QCVwVce2JX0";

const mapContainerStyle = {
  width: '100%',
  height: '87vh', // تم تعديل الارتفاع ليملأ الصفحة
};

const center = {
  lat: 34.8021, // إحداثيات مركز الخريطة (سوريا)
  lng: 38.9968,
};

const GoogleMapComponent = () => {
  return (
    <LoadScript googleMapsApiKey={googleMapsApiKey}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={6} // تم تعديل مستوى التكبير ليكون مناسبًا لسوريا
        center={center}
      >
        {/* تمت إزالة العلامة (Marker) */}
      </GoogleMap>
    </LoadScript>
  );
};

export default function Home() {
  return (<>
    <HeaderPage pluralName="الصفحة الرئيسية" />

    <Grid container spacing={2} sx={{ direction: 'rtl', height: '87vh' }}>
      <Grid item xs={3}>

      </Grid>
      <Grid item xs={9}>
        <GoogleMapComponent />
      </Grid>

    </Grid>
  </>
  );
}