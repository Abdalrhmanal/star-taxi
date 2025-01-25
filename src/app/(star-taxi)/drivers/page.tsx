"use client";
import GridTable from '@/components/data-table2'
import React from 'react'

function Drivers() {
    const dataSourceName = "api/drivers";
    const columns = [
        /* { headerName: "ID", field: "id", sortable: true }, */
        { headerName: "الاسم", field: "name", sortable: false },
        { headerName: "الايميل", field: "email", sortable: true },
        { headerName: "الجنس", field: "gender", sortable: true },
        { headerName: "رقم الجوال", field: "phone_number", sortable: true },
        { headerName: " حالة السائق", field: "driver_state", sortable: true },

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