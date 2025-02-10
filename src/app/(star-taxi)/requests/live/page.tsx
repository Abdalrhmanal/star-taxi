"use client";

import GridTable from '@/components/data-table2';
import HeaderPage from '@/components/head-page';
import React from 'react'

function RequestsLive() {

    const dataSourceName = "api/taxi-movement/current";
    const columns = [
        /* { headerName: "ID", field: "id", sortable: true }, */
        { headerName: "السائق", field: "driver_name", sortable: false },
        { headerName: "جوال السائق", field: "driver_phone", sortable: false },
        { headerName: "السيارة", field: "car_name", sortable: true },
        { headerName: "لوحة/مصباح السيارة", field: "car_plate_number", sortable: true },
        { headerName: "العميل", field: "customer_name", sortable: true },
        { headerName: "جوال العميل", field: "customer_phone", sortable: true },
        { headerName: "البداية", field: "start_address", sortable: true },
        { headerName: "الوجهة", field: "destination_address", sortable: true },
        { headerName: "التاريخ", field: "date", sortable: true },

    ];
    const handleActionClick = (row: any) => {
        console.log("Row clicked:", row);
    };
    return (
        <>
            <HeaderPage pluralName="الرحلات الحالية " />

            <GridTable
                dataSourceName={dataSourceName}
                columns={columns}
                onActionClick={handleActionClick}
            />
        </>
    )
}

export default RequestsLive;