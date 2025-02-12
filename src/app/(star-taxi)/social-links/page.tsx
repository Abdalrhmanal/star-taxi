"use client";
import GridTable from '@/components/data-table2'
import HeaderPage from '@/components/head-page'
import React from 'react'

function SocialLinks() {
    const dataSourceName = "api/social-links";
    const columns = [
        /* { headerName: "ID", field: "id", sortable: true }, */
        { headerName: "عنوان المنصة", field: "title", sortable: false },
        { headerName: "رابط المنصة", field: "link", sortable: true },
        { headerName: "ايقونة المنصة", field: "icon", sortable: true },

    ];
    const handleActionClick = (row: any) => {
        console.log("Row clicked:", row);
    };
    return (
        <>
            <HeaderPage pluralName="روابط منصات التواصل الاجتماعي" />

            <GridTable
                dataSourceName={dataSourceName}
                columns={columns}
                onActionClick={handleActionClick}
            />
        </>
    )
}

export default SocialLinks