"use client";
import GridTable from '@/components/data-table2';
import HeaderPage from '@/components/head-page';
import React from 'react'

function Advertisements() {

    const dataSourceName = "api/advertisements";
    const columns = [
        /* { headerName: "ID", field: "id", sortable: true }, */
        { headerName: "العنوان", field: "title", sortable: false },
        { headerName: "الشعار", field: "logo", sortable: true },
        { headerName: "صورة الاعلان", field: "image", sortable: true },
        { headerName: "التاريخ", field: "validity_date", sortable: true },
        { headerName: "الوصف", field: "description", sortable: true },

    ];
    const handleActionClick = (row: any) => {
        console.log("Row clicked:", row);
    };
    return (
        <>
        <HeaderPage pluralName="الاعلانات" />
             <GridTable
                dataSourceName={dataSourceName}
                columns={columns}
                onActionClick={handleActionClick}
            />
        </>
    )
}

export default Advertisements;
