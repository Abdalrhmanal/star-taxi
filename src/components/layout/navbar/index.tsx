"use client";

import React, { useState, MouseEvent, useEffect } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  InputBase,
  Badge,
  MenuItem,
  Menu,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import getEchoInstance from "@/reverb";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: 0,
  marginLeft: theme.spacing(2),
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginRight: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  left: 0, // لعكس الأيقونة للاتجاه العربي
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingRight: `calc(1em + ${theme.spacing(4)})`, // تعديل للحقل في RTL
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  useEffect(() => {
    const echo = getEchoInstance();
    if (!echo) return;

    echo.channel("chat").listen("MessageSent", (data: any) => {
      console.log("📩 New message received:", data);
    });

    return () => {
      echo.leaveChannel("chat");
    };
  }, []);
  const handleProfileMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>الملف الشخصي</MenuItem>
      <MenuItem onClick={handleMenuClose}>حسابي</MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton size="large" aria-label="عرض 4 رسائل جديدة" color="inherit">
          <Badge badgeContent={4} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>الرسائل</p>
      </MenuItem>
      <MenuItem>
        <IconButton
          size="large"
          aria-label="عرض 17 إشعارًا جديدًا"
          color="inherit"
        >
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>الإشعارات</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="حساب المستخدم الحالي"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>الملف الشخصي</p>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1, direction: "rtl" }}>
      <AppBar position="static">
        <Toolbar>
          {/* أيقونة القائمة */}
          {/*  <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="فتح القائمة"
            sx={{ ml: 2 }}
          >
            <MenuIcon />
          </IconButton> */}

          {/* اسم الموقع */}
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            StarTaxi
          </Typography>

          {/* شريط البحث */}
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="بحث…"
              inputProps={{ "aria-label": "بحث" }}
            />
          </Search>

          <Box sx={{ flexGrow: 1 }} />

          {/* عناصر القائمة في العرض الكامل */}
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <IconButton size="large" aria-label="عرض 4 رسائل جديدة" color="inherit">
              <Badge badgeContent={4} color="error">
                <MailIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              aria-label="عرض 1 إشعارًا جديدًا"
              color="inherit"
            >
              <Badge badgeContent={1} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              edge="end"
              aria-label="حساب المستخدم الحالي"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </Box>

          {/* القائمة المخفية على الشاشات الصغيرة */}
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="عرض المزيد"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
};

export default Navbar;
