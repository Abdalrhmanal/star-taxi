"use client";
import React, { MouseEvent, useState } from 'react';
import { AppBar, Toolbar, Typography, Box, Button, IconButton, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Link from 'next/link';

const Navbar = () => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const handleMenuOpen = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
            <Toolbar>
                {/* Logo */}
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                        MyWebsite
                    </Link>
                </Typography>

                {/* Desktop Menu */}
                <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                    <Link href="/about" passHref>
                        <Button color="inherit">About</Button>
                    </Link>
                    <Link href="/services" passHref>
                        <Button color="inherit">Services</Button>
                    </Link>
                    <Link href="/contact" passHref>
                        <Button color="inherit">Contact</Button>
                    </Link>
                </Box>

                {/* Mobile Menu */}
                <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={handleMenuOpen}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                    >
                        <MenuItem onClick={handleMenuClose}>
                            <Link href="/about" passHref>
                                <Typography>About</Typography>
                            </Link>
                        </MenuItem>
                        <MenuItem onClick={handleMenuClose}>
                            <Link href="/services" passHref>
                                <Typography>Services</Typography>
                            </Link>
                        </MenuItem>
                        <MenuItem onClick={handleMenuClose}>
                            <Link href="/contact" passHref>
                                <Typography>Contact</Typography>
                            </Link>
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;
