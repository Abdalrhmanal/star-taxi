import Image from "next/image";
import styles from "./page.module.css";
import { Grid } from "@mui/material";
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/side-bar";
import GridTable from "@/components/data-table2";

export default function Home({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const dataSourceName = "api/companies";
  const columns = [
    /* { headerName: "ID", field: "id", sortable: true }, */
    { headerName: "Name", field: "company_name", sortable: false },
    { headerName: "description", field: "description", sortable: true },
    { headerName: "company_email", field: "company_email", sortable: true },
    { headerName: "company_address", field: "company_address", sortable: true },
  ];

  const handleActionClick = (row: any) => {
    console.log("Row clicked:", row);
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Navbar />
        </Grid>
        <Grid item xs={9}>
          <GridTable
            dataSourceName={dataSourceName}
            columns={columns}
            onActionClick={handleActionClick}
          />
          {children}
        </Grid>
        <Grid item xs={3} >
          <Sidebar />
        </Grid>

      </Grid>
    </>
  );
}
