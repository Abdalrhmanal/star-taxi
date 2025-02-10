
import Navbar from '@/components/layout/navbar';
import Sidebar from '@/components/side-bar';
import { Grid } from '@mui/material';
import React, { FC, ReactNode } from 'react'
interface MainLayoutProps {
    children: ReactNode;
}
const MainLayout: FC<MainLayoutProps> = ({ children }) => {
    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Navbar />
                </Grid>
                <Grid item xs={9}>
                    {children}
                </Grid>
                <Grid item xs={3} >
                    <Sidebar />
                </Grid>
            </Grid>
        </>
    )
}

export default MainLayout