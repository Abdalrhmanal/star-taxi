"use client";
import React, { useState } from "react";
import StructureTable from "./structure-table";
import LoadingTable from "./loding";
import useGlobalData from "@/hooks/get-global";

interface GridTableProps {
  dataSourceName: string;
  columns: any;
  onActionClick: (row: any) => void;
}

const GridTable: React.FC<GridTableProps> = ({
  dataSourceName,
  columns,
  onActionClick,
}) => {
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  interface GlobalDataType {
    data: any[];
    pagination?: {
      totalCount: number;
    };
  }

  const {
    data: GlobalData,
    isLoading: GlobalLoading,
    refetch
  } = useGlobalData<GlobalDataType | any>({
    dataSourceName,
    enabled: true,
    setOldDataAsPlaceholder: true,
  });
 

  if (GlobalLoading) return <LoadingTable columnCount={10} rowCount={8} />;
  if (!GlobalData) return <p>No Data Available</p>;
  const refreshData = async () => {
    refetch()
  }
  return (
    <StructureTable
      rows={GlobalData?.data.movements ? GlobalData?.data.movements :GlobalData?.data  || []}
      columns={columns}
      totalCount={GlobalData.pagination?.totalCount || 0}
      pageNumber={pageNumber}
      pageSize={pageSize}
      onPageChange={(newPage, newPageSize) => {
        setPageNumber(newPage);
        setPageSize(newPageSize);
      }}
      onActionClick={onActionClick}
      onDataUpdated={refreshData}
    />
  );
};

export default GridTable;
