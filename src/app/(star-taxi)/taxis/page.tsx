"use client";
import GridTable from '@/components/data-table2';
import HeaderPage from '@/components/head-page';
import React from 'react'

function Cars() {
    const dataSourceName = "api/taxis";
    const columns = [
        /* { headerName: "ID", field: "id", sortable: true }, */
        { headerName: "السائق", field: "driverName", sortable: false },
        { headerName: "السيارة", field: "car_name", sortable: true },
        { headerName: "المصباح", field: "lamp_number", sortable: true },
        { headerName: "رقم اللوحة", field: "plate_number", sortable: true },
        //  { headerName: " حالة السائق", field: "driver_state", sortable: true },

    ];
    const handleActionClick = (row: any) => {
        console.log("Row clicked:", row);
    };
    return (
        <>
            <HeaderPage pluralName="السيارات" />
            <GridTable
                dataSourceName={dataSourceName}
                columns={columns}
                onActionClick={handleActionClick}
            />
        </>
    )
}

export default Cars;