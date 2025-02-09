import React, { useCallback, useEffect, useState } from 'react';
import { Tabs as BaseTabs, TabPanel as Tabs } from '@mui/base';
import { TabPanel as BaseTabPanel } from '@mui/base/TabPanel';
import { ScrollableBox, Tab, TabsList } from '../shared/Style-Tap';

interface TabData {
    label: string;
    content: React.ReactNode;
    value: number;
}

interface DynamicTabsProps {
    tabs: TabData[];
    initialTab?: number;
    activeTab?: number;
    onTabChange?: (tabValue: number) => void;
    higthTab: number;
}

function DynamicTabs({ tabs, initialTab = 0, activeTab, onTabChange, higthTab }: DynamicTabsProps) {
    const [tabValue, setTabValue] = useState<number>(activeTab || initialTab);

    const handleTabChange = useCallback((event: React.SyntheticEvent<Element, Event> | null, newValue: string | number | null) => {
        if (typeof newValue === 'number') {
            setTabValue(newValue);
            if (onTabChange) onTabChange(newValue);
        }
    }, [onTabChange]);

    useEffect(() => {
        if (activeTab !== undefined && activeTab !== tabValue) {
            setTabValue(activeTab);
        }
    }, [activeTab, tabValue]);

    return (
        <BaseTabs value={tabValue} onChange={handleTabChange}>
            <TabsList sx={{ justifyContent: 'center', p: 1 }}>
                {tabs.map((tab) => (
                    <Tab key={tab.value} value={tab.value}>
                        {tab.label}
                    </Tab>
                ))}
            </TabsList>

            <ScrollableBox sx={{ height: `${higthTab}vh` }}>
                {tabs.map((tab) => (
                    <BaseTabPanel key={tab.value} value={tab.value} hidden={tabValue !== tab.value}>
                        {tab.content}
                    </BaseTabPanel>
                ))}
            </ScrollableBox>
        </BaseTabs>
    );
}

export default DynamicTabs;
