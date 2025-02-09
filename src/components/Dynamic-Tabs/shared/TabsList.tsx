import { Avatar, Typography } from "@mui/material";
import { alpha, Box } from "@mui/system";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { generateRandomColor, getInitials } from "../Tab/helpers";

interface TabsListProps {
  item: any;
  selectedId: string | null;
  setSelectedId: (id: string) => void;
}

function TabsList({ item, selectedId, setSelectedId }: TabsListProps) {
  const router = useRouter();
  const [itemColor, setItemColor] = useState<string>("");

  useEffect(() => {
    const storedColor = localStorage.getItem(`color_${item?.request_id}`);
    if (storedColor) {
      setItemColor(storedColor);
    } else {
      const newColor = generateRandomColor();
      setItemColor(newColor);
      localStorage.setItem(`color_${item?.request_id}`, newColor);
    }
  }, [item?.request_id]);

  const getitemStyle = (routeId: string | undefined) => {
    return routeId === selectedId
      ? {
          backgroundColor: alpha("#007bff", 0.1),
          borderRight: "4px solid #007bff", // تغيير إلى borderRight لتناسب RTL
        }
      : {};
  };

  const handleClick = () => {
    setSelectedId(item?.request_id);
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set("Id", item?.request_id);
    router.push(newUrl.toString());
  };

  return (
    <Box
      py={1.2}
      display="flex"
      flexDirection="row-reverse"
      justifyContent="space-between"
      alignItems="center"
      sx={{
        cursor: "pointer",
        ...getitemStyle(item?.request_id),
        p: "7px",
        width: "100%",
        textAlign: "right",
      }}
      onClick={handleClick}
    >
      <Box display="flex" gap={2} alignItems="center">
        {/^#[0-9A-F]{6}$/i.test(itemColor) && (
          <Avatar
            sx={{
              color: itemColor,
              backgroundColor: alpha(itemColor, 0.12),
            }}
          >
            {getInitials(item?.customer || "زبون مجهول")}
          </Avatar>
        )}

        <Box display="flex" flexDirection="column">
          <Typography fontWeight="500">
            {item?.customer || "زبون مجهول"} - {item?.gender || "غير محدد"}
          </Typography>
          <Typography fontSize="14px" color="text.secondary">
            {item?.customer_address || "عنوان غير متوفر"} →{" "}
            {item?.destination_address || "وجهة غير متوفرة"}
          </Typography>
          <Typography fontSize="12px" color="text.secondary">
            {item?.time || "تاريخ غير متوفر"}
          </Typography>
        </Box>
      </Box>

      <Box display="flex" flexDirection="column" alignItems="flex-end">
        <Typography fontWeight="500" color="primary.light">
          {item?.drivers?.length ? "🚖 يوجد سائقين متاحين" : "⛔ لا يوجد سائقين"}
        </Typography>
        <Typography fontWeight="400" textAlign="right">
          {item?.index ? `عدد الطلبات: ${item?.index}` : "لا يوجد طلبات"}
        </Typography>
      </Box>
    </Box>
  );
}

export default TabsList;
