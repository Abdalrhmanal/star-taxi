import { Avatar, Typography } from '@mui/material';
import { alpha, Box } from '@mui/system';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { generateRandomColor, getInitials } from '../Tab/helpers';

interface TabsListProps {
  item: any;
  selectedId: string | null;
  setSelectedId: (id: string) => void;
}

function TabsList({ item, selectedId, setSelectedId }: TabsListProps) {
  const router = useRouter();
  const [itemColor, setItemColor] = useState<string>('');

  useEffect(() => {
    const storedColor = localStorage.getItem(`color_${item?.id}`);
    if (storedColor) {
      setItemColor(storedColor);
    } else {
      const newColor = generateRandomColor();
      setItemColor(newColor);
      localStorage.setItem(`color_${item?.id}`, newColor);
    }
  }, [item?.id]);

  const getitemStyle = (routeId: string | undefined) => {
    return routeId === selectedId
      ? {
        backgroundColor: alpha('#007bff', 0.1),
        borderLeft: '4px solid #007bff',
      }
      : {};
  };

  const handleClick = () => {
    setSelectedId(item?.id);
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('Id', item?.id);
    router.push(newUrl.toString());
  };

  const employeeName = item?.employee
    ? `${item?.employee.firstName || ''} ${item?.employee.lastName || ''}`.trim()
    : 'Unknown Driver';

 
  return (
    <Box
      py={1.2}
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      sx={{
        cursor: 'pointer',
        ...getitemStyle(item?.id),
        p: '7px',
        width: '100%',
      }}
      onClick={handleClick}
    >
      <Box display="flex" gap={2} alignItems="center">
        {/^#[0-9A-F]{6}$/i.test(itemColor) && (
          <Avatar sx={{ color: itemColor, backgroundColor: alpha(itemColor, 0.12) }}>
            {getInitials(typeof employeeName === 'string' ? employeeName : 'Unknown Driver')}
          </Avatar>
        )}
        <Box display="flex" flexDirection="column">
          <Typography fontWeight="500">
            {typeof employeeName === 'string' ? employeeName : 'Unknown Driver'}
          </Typography>
          <Typography fontSize="14px" color="text.secondary">#{item?.id?.slice(-4) || 'Unknown Status'}</Typography>
        </Box>
      </Box>
      <Box display="flex" flexDirection="column" alignItems="flex-end" ml="auto">
        <Typography fontWeight="500" color="primary.light">
          {item?.employee?.driverStatus}
        </Typography>
        <Typography fontWeight="400" textAlign="right">
          {`${item?.consignments?.filter(
            (consignment: { status: string }) => consignment.status === 'Completed'
          ).length ?? 0} / ${item?.consignments?.length ?? 0}`}
        </Typography>
      </Box>
    </Box>
  );
}

export default TabsList;
