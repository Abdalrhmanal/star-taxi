"use client";
import { FC, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { List, ListItem, ListItemText, Box } from "@mui/material";
import { KeyboardArrowRight, KeyboardArrowDown } from "@mui/icons-material";

interface SubItems {
  text: string;
  href: string;
}

interface MenuItemWithSubListProps {
  text: string;
  href: string;
  subItems?: SubItems[];
}

const MenuItemWithSubList: FC<MenuItemWithSubListProps> = ({
  text,
  href,
  subItems,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname(); // Get the current path

  const isActive = pathname === href; // Check if this item is active

  const handleNavigation = (url: string) => {
    router.push(url); // Navigates to the specified URL
  };

  const handleItemClick = () => {
    if (subItems) {
      setIsOpen((prev) => !prev);
    } else {
      handleNavigation(href);
    }
  };

  return (
    <Box>
      <ListItem
        sx={{
          borderRadius: "12px",
          mb: "4px",
          cursor: "pointer",
          bgcolor: isActive ? "#DDECFF" : "transparent",
          color: isActive ? "#2196F3" : "inherit",
          "&:hover": {
            bgcolor: "#E0F7FA",
          },
          textAlign: "right", // Align text to the right for Arabic language
        }}
        onClick={handleItemClick}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            flexDirection: "row-reverse", // Reverse the direction of the flex items
          }}
        >
          <ListItemText primary={text} />
          {subItems && (
            <Box>{isOpen ? <KeyboardArrowDown /> : <KeyboardArrowRight />}</Box>
          )}
        </Box>
      </ListItem>
      {isOpen && subItems && (
        <Box sx={{ ml: 4, mt: 1 }}>
          <List>
            {subItems.map((subItem) => {
              const isSubItemActive = pathname === subItem.href;
              return (
                <ListItem
                  key={subItem.text}
                  sx={{
                    borderRadius: "8px",
                    mb: "4px",
                    cursor: "pointer",
                    bgcolor: isSubItemActive ? "#E3F2FD" : "transparent",
                    color: isSubItemActive ? "#1976D2" : "inherit",
                    "&:hover": {
                      bgcolor: "#E3F2FD",
                    },
                    textAlign: "right", // Align text to the right for Arabic language
                  }}
                  onClick={() => handleNavigation(subItem.href)}
                >
                  <ListItemText primary={subItem.text} />
                </ListItem>
              );
            })}
          </List>
        </Box>
      )}
    </Box>
  );
};

export default MenuItemWithSubList;
