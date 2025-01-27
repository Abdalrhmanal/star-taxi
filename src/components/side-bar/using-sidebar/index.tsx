import { JSX } from "@emotion/react/jsx-runtime";
import HomeIcon from '@mui/icons-material/Home';
import BusinessIcon from '@mui/icons-material/Business';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import CalculateIcon from '@mui/icons-material/Calculate';
import SettingsIcon from '@mui/icons-material/Settings';
import CampaignIcon from '@mui/icons-material/Campaign'; 
import AssessmentIcon from '@mui/icons-material/Assessment'; 
export interface MenuItem {
  text: string;
  href: string;
  icon: JSX.Element;
  isActive: boolean;
  isExpanded?: boolean;
  children?: MenuItem[];
}

export const menuItems: MenuItem[] = [
  { text: "الصفحة الرئيسية", href: "/", icon: <HomeIcon />, isActive: false },
  {
    text: "الطلبات",
    href: "",
    icon: <BusinessIcon />,
    isActive: false,
    isExpanded: false,
    children: [
      { text: "الطلبات الحالية", href: "/requests", icon: <BusinessIcon />, isActive: false },
      { text: "الطلبات المنتهية", href: "/requests", icon: <BusinessIcon />, isActive: false },
    ],
  },
  { text: "السائقين", href: "/drivers", icon: <PeopleAltIcon />, isActive: false },
  { text: "السيارات", href: "/cars", icon: <DirectionsCarIcon />, isActive: false },
  { text: "الرحلات", href: "/trips", icon: <FlightTakeoffIcon />, isActive: false },
  { text: "الحسابات", href: "/accounts", icon: <CalculateIcon />, isActive: false },
  { text: "الاعلانات", href: "/advertisements", icon: <CampaignIcon />, isActive: false },
  { text: "التقارير", href: "/reports", icon: <AssessmentIcon />, isActive: false },
  { text: "الاعدادات", href: "/settings", icon: <SettingsIcon />, isActive: false },
];
