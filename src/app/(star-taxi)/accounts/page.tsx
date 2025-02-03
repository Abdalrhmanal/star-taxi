"use client";

import GridTable from '@/components/data-table2';
import React from 'react'

function Accounts() {
    const dataSourceName = "api/calculations";
    const columns = [
        /* { headerName: "ID", field: "id", sortable: true }, */
        { headerName: "الاسم", field: "name", sortable: false },
        { headerName: "لوحة السيارة", field: "plate_number", sortable: true },
        { headerName: "الحساب اليومي", field: "today_account", sortable: true },
        { headerName: "جميع الحسابات", field: "all_account", sortable: true },

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

export default Accounts;

