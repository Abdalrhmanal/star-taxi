import { Box, Grid, Typography, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import React from 'react';
import { useRouter } from 'next/navigation';

function HeaderPageD({ pluralName }: any) {
    const router = useRouter();

    const handleBackClick = () => {
        router.back();
    };

    return (
        <Grid container spacing={2} alignItems="center" sx={{ height: 50 }}>
            <Grid item xs={6}>
                <Box display="flex" height="100%" justifyContent="flex-start" sx={{ borderRadius: 2, textAlign: "end", gap: 1 }}>
                    <IconButton onClick={handleBackClick}>
                        <ArrowBackIcon />
                    </IconButton>
                </Box>
            </Grid>
            <Grid item xs={6}>
                <Box display="flex" height="100%" justifyContent="flex-end" sx={{ borderRadius: 2, textAlign: "end", gap: 1 }}>
                    <Box sx={{ ml: 1 }}>
                        <Typography variant="h4" sx={{ fontSize: "20px" }}>
                            {pluralName}
                        </Typography>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
}

export default HeaderPageD;