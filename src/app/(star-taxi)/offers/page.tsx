"use client";
import GridTable from '@/components/data-table2';
import React from 'react'

function Offers() {
    const dataSourceName = "api/offers";
    const columns = [
        /* { headerName: "ID", field: "id", sortable: true }, */
        { headerName: "العرض", field: "offer", sortable: false },
        { headerName: "حجم الخصم", field: "value_of_discount", sortable: true },
        { headerName: "التاريخ", field: "valid_date", sortable: true },
        { headerName: "النوع ", field: "type", sortable: true },
        { headerName: "السعر", field: "price", sortable: true },
        { headerName: "الوصف", field: "description", sortable: true },

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

export default Offers;