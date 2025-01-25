import React from "react";
import { Typography, Chip } from "@mui/material";

export const renderCell = (field: string, value: any, row: any): React.ReactNode => {
  switch (field) {
    case "driver_state":
      return (
        <Chip
          label={row.driver_state === "Ready" ? "نشط" : "غير نشط"}
          color={row.driver_state === "Ready" ? "success" : "error"}
        />
      );

    case "age":
      return <Typography color="primary" sx={{color:"red"}}>{row.age} سنة</Typography>;

    case "name":
      return <Typography fontWeight="bold" sx={{color:"red"}}>{row.name}</Typography>;

    case "actions":
      return (
        <Typography
          style={{
            cursor: "pointer",
            color: "#1976d2",
            textDecoration: "underline",
          }}
          onClick={() => alert(`تم النقر على ${row.name}`)}
        >
          عرض
        </Typography>
      );

    default:
      return value ?? "-";
  }
};
