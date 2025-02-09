"use client";
import React, { useState, useEffect } from 'react';

import { TextField, InputAdornment, Box, CircularProgress, Typography } from '@mui/material';
import { SearchOutlined } from '@mui/icons-material';
import DynamicTabs from './Tab/DynamicTabs';
import DynamicList from './Tab/DynamicList';
import TabsList from './shared/TabsList';
import TabDefault from './shared/Tab';
import RouteOutlinedIcon from '@mui/icons-material/RouteOutlined';
import ContactMailOutlinedIcon from '@mui/icons-material/ContactMailOutlined';

function TabDynamis({ routesData, higthTab, isLoading }: { routesData: any[], isLoading: boolean, higthTab: number }) {
    const [itemSearchQuery, setItemSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState(0);

    const filterItems = (items: any[], searchField: string) => {
        if (!items || !Array.isArray(items)) {
            console?.error("Invalid itemsData", items);
            return [];
        }
        if (!itemSearchQuery) {
            return items;
        }

        return items.filter((item: any) => {
            if (!item[searchField]) {
                console.error(`Missing field: ${searchField} in item`, item);
                return false;
            }
            return item[searchField].toLowerCase().includes(itemSearchQuery.toLowerCase());
        });
    };

    const tabsConfig = [
        {
            label: 'طلبات',
            value: 0,
            searchField: 'requests',
            content: (filteredItems: any[]) => (
                <>
                    {filteredItems.length > 0 ? (
                        <DynamicList
                            items={filteredItems}
                            onSelectItem={(item) => console.log('Selected Requests:', item)}
                            renderItem={(item) => (
                                <TabsList item={item} selectedId={''} setSelectedId={() => { }} />
                            )}
                        />
                    ) : (
                        isLoading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: "50vh",
                                    textAlign: "center"
                                }}
                            >
                                <ContactMailOutlinedIcon sx={{ color: "#E0E0E0", fontSize: 57, mb: 2 }} />
                                <Typography fontWeight={500} fontSize={16} sx={{ opacity: "60%" }}>
                                    لا يوجد طلبات جديدة متاحة
                                </Typography>
                                <Typography fontSize={14} sx={{ opacity: "60%", mt: 1 }}>
                                    يرجى الانتظار الى ان يقوم العميل بإرسال طلب جديد
                                </Typography>
                            </Box>
                        )
                    )}
                </>
            ),
        },
        /* {
            label: 'Routes',
            value: 1,
            searchField: 'name',
            content: (filteredItems: any[]) => (
                <>
                    {filteredItems.length > 0 ? (
                        <DynamicList
                            items={filteredItems}
                            onSelectItem={(item) => console.log('Selected Item:', item)}
                            renderItem={(item) => (
                                <TabDefault item={item} />
                            )}
                        />
                    ) : (
                        isLoading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: "50vh",
                                    textAlign: "center"
                                }}
                            >
                                <RouteOutlinedIcon sx={{ color: "#E0E0E0", fontSize: 57, mb: 2 }} />
                                <Typography fontWeight={500} fontSize={16} sx={{ opacity: "60%" }}>
                                    No active routes available for the selected date
                                </Typography>
                                <Typography fontSize={14} sx={{ opacity: "60%", mt: 1 }}>
                                    Please choose a different date
                                </Typography>
                            </Box>
                        )
                    )}
                </>
            ),
        }, */
    ];

    const currentTabConfig = tabsConfig[activeTab];
    const filteredItems = filterItems(routesData, currentTabConfig.searchField);

    return (
        <>
            <DynamicTabs
                tabs={tabsConfig.map((tab, index) => ({
                    label: tab.label,
                    value: index,
                    content: (
                        <>
                            <Box paddingBottom={1} sx={{ pl: 1, pr: 1 }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    variant="outlined"
                                    value={itemSearchQuery}
                                    onChange={e => setItemSearchQuery(e.target.value)}
                                    placeholder={`ابحث عن ${tab.label}`}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchOutlined />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Box>
                            {isLoading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                    <CircularProgress />
                                </Box>
                            ) : (
                                tab.content(filteredItems)
                            )}
                        </>
                    ),
                }))}
                onTabChange={(newValue: number) => setActiveTab(newValue)}
                higthTab={higthTab}
            />
        </>
    );
}

export default TabDynamis;
