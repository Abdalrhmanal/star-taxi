"use client";
import React, { useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Checkbox,
  IconButton,
  Box,
  TableSortLabel,
  Typography,
  TextField,
  Grid,
  Button,
} from "@mui/material";
import { renderCell } from "../using-cellRenderer";
import AddIcon from '@mui/icons-material/Add';
import ActionsCell from "../actions-cell";
import { useRouter } from "next/navigation";

interface Column {
  field: string;
  headerName: string;
  sortable?: boolean;
}

interface RowData {
  id: string;
  [key: string]: any;
}

interface StructureTableProps {
  rows: RowData[];
  columns: Column[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  pageSizeOptions?: number[];
  onPageChange?: (newPage: number, newPageSize: number) => void;
  onActionClick?: (row: RowData) => void;
  onDataUpdated: () => void;
}

const StructureTable: React.FC<StructureTableProps> = ({
  rows,
  columns,
  totalCount,
  pageNumber,
  pageSize,
  pageSizeOptions = [5, 10, 25],
  onPageChange,
  onActionClick,
  onDataUpdated
}) => {
  const [orderBy, setOrderBy] = useState<string | null>(null);
  const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const router = useRouter();

  const handleSort = (field: string) => {
    const isAsc = orderBy === field && orderDirection === "asc";
    const direction = isAsc ? "desc" : "asc";
    setOrderBy(field);
    setOrderDirection(direction);
  };

  const handleRowSelect = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedRows(rows.map((row) => row.id));
    } else {
      setSelectedRows([]);
    }
  };

  const filteredRows = searchTerm
    ? rows.filter((row) =>
        columns.some((column) =>
          row[column.field]
            ?.toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        )
      )
    : rows;

  const sortedRows = filteredRows.sort((a, b) => {
    if (!orderBy) return 0;
    const aValue = a[orderBy] || "";
    const bValue = b[orderBy] || "";
    if (orderDirection === "asc") return aValue > bValue ? 1 : -1;
    return aValue < bValue ? 1 : -1;
  });

  const paginatedRows = sortedRows.slice(
    pageNumber * pageSize,
    pageNumber * pageSize + pageSize
  );

  // دالة زر الإضافة
  const handleAddClick = () => {
    const currentPath = window.location.pathname; // الحصول على المسار الحالي
    router.push(`${currentPath}/create`); // إضافة /create إلى المسار الحالي
  };
  const refreshData = async () => {
    onDataUpdated();
  }

  return (
    <Box p={1} sx={{ direction: "rtl" }}>

      <Grid container spacing={2} alignItems="center">
        <Grid item xs={10}>
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            placeholder="بحث..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              input: { textAlign: "right" },
            }}
          />
        </Grid>

        <Grid item xs={2} textAlign="center">
          <Button
            variant="contained"
            endIcon={<AddIcon />}
            fullWidth
            onClick={handleAddClick} // استخدام الدالة المعدلة
          >
            اضافة
          </Button>
        </Grid>
      </Grid>

      <Table>
        {/* رأس الجدول */}
        <TableHead sx={{ borderBottom: "2px solid" }}>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                indeterminate={
                  selectedRows.length > 0 &&
                  selectedRows.length < rows.length
                }
                checked={rows.length > 0 && selectedRows.length === rows.length}
                onChange={handleSelectAll}
              />
            </TableCell>
            {columns.map((column) => (
              <TableCell
                key={column.field}
                sx={{
                  fontSize: "16px",
                  color: "#2196F3",
                  fontWeight: "bold",
                  textAlign: "right",
                }}
              >
                {column.sortable ? (
                  <TableSortLabel
                    active={orderBy === column.field}
                    direction={orderDirection}
                    onClick={() => handleSort(column.field)}
                    sx={{ color: "#2196F3" }}
                  >
                    {column.headerName}
                  </TableSortLabel>
                ) : (
                  column.headerName
                )}
              </TableCell>
            ))}
            <TableCell
              align="center"
              sx={{
                fontSize: "16px",
                color: "#2196F3",
                fontWeight: "bold",
              }}
            >
              العمليات
            </TableCell>
          </TableRow>
        </TableHead>

        {/* جسم الجدول */}
        <TableBody sx={{ backgroundColor: "#fff", borderTop: 1 }}>
          {paginatedRows.length > 0 ? (
            paginatedRows.map((row, index) => (
              <TableRow key={row.id || index}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedRows.includes(row.id)}
                    onChange={() => handleRowSelect(row.id)}
                  />
                </TableCell>
                {columns.map((column) => (
                  <TableCell
                    key={column.field}
                    sx={{ textAlign: "right" }}
                  >
                    {renderCell(column.field, row[column.field], row)}
                  </TableCell>
                ))}
                <TableCell align="center">
                  <ActionsCell row={row} onDataUpdated={refreshData} />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length + 2} align="center">
                <Typography variant="body1">لا توجد بيانات متاحة</Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <TablePagination
        sx={{ backgroundColor: "#717680" }}
        rowsPerPageOptions={pageSizeOptions}
        component="div"
        count={filteredRows.length}
        rowsPerPage={pageSize}
        page={pageNumber}
        onPageChange={(event, newPage) => {
          onPageChange?.(newPage, pageSize);
        }}
        onRowsPerPageChange={(event) => {
          onPageChange?.(0, parseInt(event.target.value, 10));
        }}
      />
    </Box>
  );
};

export default StructureTable;
