"use client";
import React, { useState, MouseEvent, useEffect } from "react";
import { useRouter } from "next/navigation"; // استيراد useRouter
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
  Button,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import HomeIcon from "@mui/icons-material/Home";
import BusinessIcon from "@mui/icons-material/Business";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
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
  left: 0,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingRight: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

export interface MenuItemType {
  text: string;
  href: string;
  icon: React.ReactNode;
  isActive: boolean;
}

export const menuItems: MenuItemType[] = [
  { text: "الصفحة الرئيسية", href: "/", icon: <HomeIcon />, isActive: false },
  { text: "الطلبات", href: "/requests/live", icon: <BusinessIcon />, isActive: false },
  { text: "السائقين", href: "/drivers", icon: <PeopleAltIcon />, isActive: false },
];

const Navbar = () => {
  const router = useRouter(); // استخدام useRouter
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

  const handleNavigation = (href: string) => {
    router.push(href); // التنقل باستخدام router.push()
  };

  return (
    <Box sx={{ flexGrow: 1, direction: "rtl" }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ display: { xs: "none", sm: "block" } }}>
            StarTaxi
          </Typography>

          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase placeholder="بحث…" inputProps={{ "aria-label": "بحث" }} />
          </Search>

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
            {menuItems.map((item, index) => (
              <Button
                key={index}
                startIcon={item.icon}
                color={item.isActive ? "primary" : "inherit"}
                onClick={() => handleNavigation(item.href)}
                sx={{ color: item.isActive ? "primary" : "inherit", p: 1 }}
              >
                <Typography variant="h6" sx={{ display: { xs: "none", sm: "block" }, p: 1 }}>
                  {item.text}
                </Typography>
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <IconButton size="large" aria-label="عرض 1 إشعارًا جديدًا" color="inherit">
              <Badge badgeContent={1} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              edge="end"
              aria-label="حساب المستخدم الحالي"
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </Box>

          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton size="large" aria-label="عرض المزيد" color="inherit">
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
