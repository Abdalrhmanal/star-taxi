import React from "react";
import { Typography, Chip, Grid, Avatar } from "@mui/material";

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
      return <Typography color="primary" sx={{ color: "red" }}>{row.age} سنة</Typography>;

    case "name":
      return <>
        <Grid container spacing={1}>
          <Grid item xs={4}>
            <Avatar
              alt="User Avatar"
              src={`https://tawsella.online/api/${row.avatar}`} 
              sx={{ width: 40, height: 40 }} 
            />
          </Grid>
          <Grid item xs={8}>
            <Grid item xs={12} >
              <Typography fontWeight="bold" sx={{ color: "red" }}>{row.name}</Typography>
            </Grid>
            <Grid item xs={12} >
              <Typography fontWeight="bold" sx={{ color: "red" }}>{row.gender}</Typography>
            </Grid>
          </Grid>

        </Grid>

      </>;

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
