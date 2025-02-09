import { Box, Typography } from '@mui/material'
import React from 'react'
import { getStatusColor } from '../Tab/helpers'

function TabDefault({item}: any) {
  console.log(item);

  return (
    <Box
      py={1.2}
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      sx={{
        cursor: 'pointer',
        p: '7px',
        width: '100%',
      }}
    >
      <Box display="flex" gap={2} alignItems="center">
        <Box display="flex" flexDirection="column">
          <Typography fontSize="16px" sx={{ opacity: "87%", color: "black",fontWeight:500 }}>#{item?.id?.slice(-4) || 'Unknown Status'}</Typography>
          <Typography fontSize="14px" sx={{ opacity: "60%", color: "black" }} >{item?.employee?.firstName + ' ' + item?.employee?.lastName || 'Unknown Driver'}</Typography>
        </Box>
      </Box>
      <Box
        sx={{
          p: 0.6,
          color: getStatusColor(item?.status as unknown as any).color,
          borderRadius: 1,
          textAlign: 'center',
        }}
      >
        <Typography fontWeight="500">
          {item.status}
        </Typography>
      </Box>

    </Box>
  )
}

export default TabDefault