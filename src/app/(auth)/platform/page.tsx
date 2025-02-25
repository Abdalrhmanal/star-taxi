import React from 'react';
import { Container, Grid, Typography, Button, Box } from '@mui/material';
import Image from 'next/image';

function AppDownloadPage() {
    return (
        <Container maxWidth="lg" sx={{ mt: 5 }}>
            <Typography variant="h4" align="center" gutterBottom>
                تحميل التطبيق
            </Typography>
            <Grid container spacing={2} justifyContent="center">
                {[...Array(6)].map((_, index) => (
                    <Grid item key={index} xs={12} sm={6} md={3}>
                        <Image src={`/images/${index + 1}.jpg`} alt={`Image ${index + 1}`} width={200} height={200} />
                    </Grid>
                ))}
            </Grid>
            <Box sx={{ mt: 5, textAlign: 'center' }}>
                <Button variant="contained" color="primary" href="/app-release.apk" download>
                    تحميل النسخة أندرويد
                </Button>
                <Button variant="contained" color="secondary" href="/app-release.apk" download sx={{ ml: 2 }}>
                    تحميل النسخة iOS
                </Button>
            </Box>
        </Container>
    );
}

export default AppDownloadPage;