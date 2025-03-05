import React from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Skeleton,
  Box,
} from "@mui/material";

interface LoadingTableProps {
  columnCount: number;
  rowCount: number;
}

const LoadingTable: React.FC<LoadingTableProps> = ({
  columnCount,
  rowCount,
}) => {
  return (
    <Box p={1}>
      <Table sx={{ direction: "rtl" }}>
        {/* Table Header */}
        <TableHead sx={{ borderBottom: "2px solid", backgroundColor: "#f0f8ff" }}>
          <TableRow>
            <TableCell padding="checkbox">
              <Skeleton
                variant="rectangular"
                width={20}
                height={20}
                sx={{ bgcolor: "#e3f2fd" }}
              />
            </TableCell>
            {Array.from({ length: columnCount }).map((_, index) => (
              <TableCell
                key={index}
                sx={{ fontSize: "16px", color: "#2196F3", fontWeight: "bold" }}
              >
                <Skeleton
                  variant="text"
                  width="60%"
                  sx={{ bgcolor: "#e3f2fd" }}
                />
              </TableCell>
            ))}
            <TableCell align="center" sx={{ fontSize: "16px", color: "#2196F3", fontWeight: "bold" }}>
              <Skeleton
                variant="text"
                width="80%"
                sx={{ bgcolor: "#e3f2fd" }}
              />
            </TableCell>
          </TableRow>
        </TableHead>
        {/* Table Body */}
        <TableBody sx={{ backgroundColor: "#fff" }}>
          {Array.from({ length: rowCount }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              <TableCell padding="checkbox">
                <Skeleton
                  variant="rectangular"
                  width={20}
                  height={20}
                  sx={{ bgcolor: "#e3f2fd" }}
                />
              </TableCell>
              {Array.from({ length: columnCount }).map((_, colIndex) => (
                <TableCell key={colIndex}>
                  <Skeleton
                    variant="text"
                    width="80%"
                    sx={{ bgcolor: "#e3f2fd" }}
                  />
                </TableCell>
              ))}
              <TableCell align="center">
                <Skeleton
                  variant="rectangular"
                  width={60}
                  height={30}
                  sx={{ bgcolor: "#e3f2fd" }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default LoadingTable;
