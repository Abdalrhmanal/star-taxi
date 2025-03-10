"use client";

import GridTable from '@/components/data-table2';
import HeaderPage from '@/components/head-page';
import React from 'react'

function Accounts() {
    const dataSourceName = "api/calculations";
    const columns = [
        /* { headerName: "ID", field: "id", sortable: true }, */
        { headerName: "الاسم", field: "name", sortable: false },
        { headerName: "لوحة السيارة", field: "plate_number", sortable: true },
        { headerName: "الحساب اليومي", field: "today_accounted", sortable: true },
        { headerName: "جميع الحسابات", field: "all_accounted", sortable: true },
    ];
    const handleActionClick = (row: any) => {
        console.log("Row clicked:", row);
    };
    return (
        <>
        <HeaderPage pluralName="الحسابات" />
            <GridTable
                dataSourceName={dataSourceName}
                columns={columns}
                onActionClick={handleActionClick}
            />
        </>
    )
}

export default Accounts;

