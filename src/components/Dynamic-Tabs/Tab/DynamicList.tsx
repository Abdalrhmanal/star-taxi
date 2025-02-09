import React, { useCallback, useState } from 'react';
import { Box, Typography, Divider } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useRouter } from 'next/navigation';

interface ListItem {
  id?: string;
  [key: string]: any;
}

interface DynamicListProps {
  items: ListItem[];
  onSelectItem: (item: ListItem | null) => void;
  renderItem: (item: ListItem) => React.ReactNode;
  isLoading?: boolean;
}

const DynamicList = ({ items, onSelectItem, renderItem, isLoading = false }: DynamicListProps) => {
  const router = useRouter();
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const handleClick = useCallback(
    (item: ListItem) => {
      onSelectItem(item);
      setSelectedItemId(item.id || null);

      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('selectedItemId', item.id || '');
      router.push(newUrl.toString());
    },
    [router, onSelectItem]
  );

  if (isLoading) {
    return <Typography align="center">Loading...</Typography>;
  }

  return (
    <>
      {items.length > 0 ? (
        items.map((item) => (
          <React.Fragment key={item.id}>
            <Box
              py={1.2}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              onClick={() => handleClick(item)}
              sx={{
                cursor: 'pointer',
                p: '7px',
                backgroundColor: item.id === selectedItemId ? alpha('#007bff', 0.1) : 'transparent',
              }}
            >
              {renderItem(item)}
            </Box>
            <Divider />
          </React.Fragment>
        ))
      ) : (
        <Typography align="center">No items available</Typography>
      )}
    </>
  );
};

export default DynamicList;
