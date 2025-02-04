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
    case "driverName":
      return <>
        <Grid container spacing={1}>
          <Grid item xs={4}>
            <Avatar
              alt="User Avatar"
              src={`https://tawsella.online/${row.avatar || row.driverAvatar}`}
              sx={{ width: 40, height: 40 }}
            />
          </Grid>
          <Grid item xs={8}>
            <Grid item xs={12} >
              <Typography fontWeight="bold" sx={{ color: "red" }}>{row.name || row.driverName || ''}</Typography>
            </Grid>
            <Grid item xs={12} >
              <Typography fontWeight="bold" sx={{ color: "red" }}>{row.gender || ''}</Typography>
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
    case "logo":
      console.log(row.logo);

      return (
        <Avatar
          alt="User Avatar"
          src={`https://tawsella.online/${row.logo}`}
          sx={{ width: 40, height: 40 }}
        />
      );
    case "image":
      return (
        <Avatar
          alt="User Avatar"
          src={`https://tawsella.online/${row.image}`}
          sx={{ width: 100, height: 100 }}
          variant="square" 
        />
      );
    default:
      return value ?? "-";
  }
};
