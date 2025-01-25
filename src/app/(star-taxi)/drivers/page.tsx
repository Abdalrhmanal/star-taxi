"use client";
import GridTable from '@/components/data-table2'
import React from 'react'

function Drivers() {
    const dataSourceName = "api/drivers";
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
            <GridTable
                dataSourceName={dataSourceName}
                columns={columns}
                onActionClick={handleActionClick}
            />
        </>
    )
}

export default Drivers