import { Avatar, Typography, Button } from "@mui/material";
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

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'مساءً' : 'صباحًا';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  const handleCopyPhoneNumber = () => {
    if (item?.customer_phone) {
      navigator.clipboard.writeText(item.customer_phone);
      alert("تم نسخ رقم الهاتف إلى الحافظة");
    }
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
            {getInitials(item?.customer_name || "زبون مجهول")}
          </Avatar>
        )}

        <Box display="flex" flexDirection="column">
          <Typography fontWeight="500">
            {item?.customer_name || "زبون مجهول"} - {item?.gender || "غير محدد"}
          </Typography>
          <Typography fontSize="14px" color="text.secondary">
            {item?.start_address || "عنوان غير متوفر"} ⬅️{" "}
            {item?.destination_address || "وجهة غير متوفرة"}
          </Typography>
          <Typography fontSize="12px" color="text.secondary">
            {item?.date ? formatTime(item.date) : "تاريخ غير متوفر"}
          </Typography>
          <Button
            variant="text"
            onClick={handleCopyPhoneNumber}
            sx={{ textAlign: "right", padding: 0, minWidth: 0 }}
          >
            {item?.customer_phone || "رقم الهاتف غير متوفر"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default TabsList;