import React from "react";
import { Typography, Chip, Grid, Avatar } from "@mui/material";
import { getStatusStyle } from "@/components/helper/style-status";

export const renderCell = (field: string, value: any, row: any): React.ReactNode => {
  switch (field) {
    case "driver_state":
      return (
        <Chip label={row.driver_state} sx={getStatusStyle(row.driver_state)} />
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
    case "icon":
      return (
        <Avatar
          alt="User Avatar"
          src={`https://tawsella.online/${row.logo || row.icon}`}
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
    case "car_plate_number":
      return (
        <Typography fontWeight="bold">{row.car_plate_number + '/' + row.car_lamp_number || ''}</Typography>
      );

    case "price1":
      return (
        <Typography fontWeight="bold">{row.price1 + ' ' + row.payment1 || ''}</Typography>
      );
    case "price2":
      return (
        <Typography fontWeight="bold">{row.price2 + ' ' + row.payment2 || ''}</Typography>
      );
    case "date":
      const formattedDate = row.date ? new Intl.DateTimeFormat('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).format(new Date(row.date)) : '';
      return (
        <Typography fontWeight="bold">{formattedDate}</Typography>
      );
    case "today_accounted":
      return (
        <Typography fontWeight="bold">
          {Array.isArray(row.today_account) && row.today_account.length > 0
            ? `${row.today_account[0].coin} ${row.today_account[0].total_amount}`
            : '00'}
        </Typography>
      );
    case "all_accounted":
      return (
        <Typography fontWeight="bold">
          {Array.isArray(row.all_account) && row.all_account.length > 0
            ? `${row.all_account[0].coin} ${row.all_account[0].total_amount}`
            : '00'}
        </Typography>
      );
    case "is_onKM":
      return (
        <Typography fontWeight="bold">
          {row.is_onKM ? "نعم يعتمد على المسافة" : "لا يعتمد على المسافة"}
        </Typography>
      );
    default:
      return value ?? "-";
  }
};