"use client";
import GridTable from '@/components/data-table2';
import HeaderPage from '@/components/head-page';
import React from 'react'

function Trips() {
    const dataSourceName = "api/movement-types";
    const columns = [
        /* { headerName: "ID", field: "id", sortable: true }, */
        { headerName: "العنوان", field: "type", sortable: false },
        { headerName: "الوصف", field: "description", sortable: true },
        { headerName: "السعر", field: "price", sortable: true },
       

    ];
    const handleActionClick = (row: any) => {
        console.log("Row clicked:", row);
    };
    return (
        <>
            <HeaderPage pluralName="الرحلات المتوفرة" />

            <GridTable
                dataSourceName={dataSourceName}
                columns={columns}
                onActionClick={handleActionClick}
            />
        </>
    )
}

export default Trips;