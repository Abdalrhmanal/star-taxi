"use client";
import { FC, ReactNode, useState } from "react";
import Box from "@mui/material/Box";
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/side-bar";
import Drawer from "@mui/material/Drawer";
import Fab from "@mui/material/Fab";
import MenuIcon from "@mui/icons-material/Menu";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: FC<MainLayoutProps> = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen((prev) => !prev);
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "#DDECFF99" }}>
      <Box
        sx={{
          width: "100%",
          position: "fixed",
          top: 0,
          right: 0,
          left: 0,
          bgcolor: "#FDFDFD",
          overflowY: "auto",
          zIndex: 1200,
        }}
      >
        <Navbar />
      </Box>

      <Box sx={{ display: "flex", flex: 1, overflow: "hidden", pt: "80px" }}>
        <Box
          sx={{
            display: { xs: "none", md: "block" },
            width: { md: "25%" },
            minWidth: { md: "250px" },
            maxWidth: { md: "300px" },
            position: "fixed",
            top: "80px",
            right: 0,
            bottom: 0,
            bgcolor: "#FDFDFD",
            boxShadow: "-2px 0px 10px rgba(0,0,0,0.1)",
            borderRadius: "20px 0 0 20px",
            overflowY: "auto",
          }}
        >
          <Sidebar />
        </Box>

        <Box
          sx={{
            flex: 1,
            mr: { xs: 0, md: "300px" },
            height: "calc(95vh - 80px)",
            overflowY: "auto",
            padding: 2,
            transform: "scaleX(-1)",
            "& > *": {
              transform: "scaleX(-1)",
            },
          }}
        >
          {children}
        </Box>
      </Box>

      <Box
        sx={{
          display: { xs: "block", md: "none" },
          position: "fixed",
          bottom: 16,
          right: 16,
          zIndex: 1300,
        }}
      >
        <Fab color="primary" onClick={handleDrawerToggle}>
          <MenuIcon />
        </Fab>
      </Box>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerToggle}
      >
        <Sidebar />
      </Drawer>
    </Box>
  );
};

export default MainLayout;
