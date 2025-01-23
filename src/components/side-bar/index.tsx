"use client";
import { FC, useState } from "react";
import {
  List,
  Box,
  Typography,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Switch,
  Button,
} from "@mui/material";
import {
  DarkModeOutlined,
  ExpandLess,
  ExpandMore,
  LogoutOutlined,
} from "@mui/icons-material";
import { MenuItem, menuItems } from "./using-sidebar/index";
import useLogout from "@/hooks/logout";

const Sidebar: FC = () => {
  const [items, setItems] = useState(menuItems);

  const handleItemClick = (clickedItemText: string) => {
    const updatedItems = items.map((item) => {
      if (item.text === clickedItemText) {
        return {
          ...item,
          isExpanded: !item.isExpanded,
        };
      }
      return item;
    });
    setItems(updatedItems);
  };

  const handleSubItemClick = (parentText: string, subItemText: string) => {
    const updatedItems = items.map((item) => {
      if (item.text === parentText && item.children) {
        const updatedChildren = item.children.map((child) => ({
          ...child,
          isActive: child.text === subItemText,
        }));
        return { ...item, children: updatedChildren };
      }
      return item;
    });
    setItems(updatedItems);
  };

  const renderMenuItems = (menu: MenuItem[]) => {
    return menu.map((item) => (
      <Box key={item.text}>
        <ListItem
          component="button"
          onClick={() => handleItemClick(item.text)}
          sx={{
            bgcolor: item.isActive ? "#E3F2FD" : "transparent",
            color: item.isActive ? "#1976D2" : "#000",
            borderRadius: "8px",
            mb: "8px",
            "&:hover": {
              bgcolor: "#F5F5F5",
            },
            textAlign: "right",
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: "auto",
              marginLeft: "8px",
            }}
          >
            {item.icon}
          </ListItemIcon>
          <ListItemText
            primary={item.text}
            sx={{
              textAlign: "right",
            }}
          />
          {item.children && (item.isExpanded ? <ExpandLess /> : <ExpandMore />)}

        </ListItem>

        {item.children && (
          <Collapse in={item.isExpanded} timeout="auto" unmountOnExit>
            <List sx={{ pl: 2 }}>
              {item.children.map((child) => (
                <ListItem
                  key={child.text}
                  component="button"
                  onClick={() => handleSubItemClick(item.text, child.text)}
                  sx={{
                    bgcolor: child.isActive ? "#E3F2FD" : "transparent",
                    color: child.isActive ? "#1976D2" : "#000",
                    borderRadius: "8px",
                    mb: "8px",
                    "&:hover": {
                      bgcolor: "#F5F5F5",
                    },
                    textAlign: "right",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: "auto",
                      marginLeft: "8px",
                    }}
                  >
                    {child.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={child.text}
                    sx={{
                      textAlign: "right",
                    }}
                  />

                </ListItem>
              ))}
            </List>
          </Collapse>
        )}
      </Box>
    ));
  };

  const { logout, loading, error } = useLogout();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "85vh",
        backgroundColor: "#FDFDFD",
        padding: "16px",
        direction: "rtl", 
        ml: "auto",
        borderRadius: "20px",
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.08)",
      }}
    >
      <Box sx={{ overflowY: "auto", maxHeight: "80%" }}>
        <Box>
          <List>{renderMenuItems(items)}</List>
        </Box>
      </Box>

      <Box
        sx={{
          backgroundColor: "#ffffff",
          padding: "16px",
          display: "flex",
          justifyContent: "flex-end",
          width: "100%",
        }}
      >
        <Button
          startIcon={<LogoutOutlined />}
          variant="contained"
          fullWidth
          sx={{
            borderRadius: "12px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "16px 12px 16px 24px",
            textTransform: "none",
            background:
              "linear-gradient(52.07deg, #2196F3 -7.59%, #ADC4D7 129.4%)",
          }}
          onClick={logout}
          disabled={loading}
        >
          {loading ? "جاري تسجيل الخرووج..." : "تسجيل الخروج"}
        </Button>
        {error && <Box sx={{ color: "error.main", mt: "8px" }}>{error}</Box>}
      </Box>
    </Box>
  );
};

export default Sidebar;
