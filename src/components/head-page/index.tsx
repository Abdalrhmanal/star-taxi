import { Box, Button, Grid, Skeleton, Typography } from '@mui/material';
import React from 'react'

function HeaderPage({ pluralName }: any) {

    return (
        <>
            <Grid container spacing={2} alignItems="center" sx={{ height: 50 }}>
                <Grid item xs={12}>
                    <Box display="flex" height="100%" justifyContent="flex-end" sx={{ borderRadius: 2, textAlign: "end", gap: 1  }}>
                        <Box sx={{ ml: 1 }}>
                            <Typography variant="h4" sx={{ fontSize: "20px" }}>
                                {pluralName}
                            </Typography>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </>
    )
}

export default HeaderPage;