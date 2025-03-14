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
      { text: "الطلبات الحالية", href: "/requests/live", icon: <BusinessIcon />, isActive: false },
      { text: "الطلبات المنتهية", href: "/requests/done", icon: <BusinessIcon />, isActive: false },
    ],
  },
  { text: "السائقين", href: "/drivers", icon: <PeopleAltIcon />, isActive: false },
  { text: "السيارات", href: "/taxis", icon: <DirectionsCarIcon />, isActive: false },
  { text: "الرحلات", href: "", icon: <FlightTakeoffIcon />, isActive: false, isExpanded: false,
    children: [
      { text: "اسعار الرحلات", href: "/movement-types/m-inside", icon: <FlightTakeoffIcon />, isActive: false },
      { text: "الرحلات الاساسية", href: "/movement-types/m-out", icon: <FlightTakeoffIcon />, isActive: false },
    ], },
  { text: "العروض", href: "/offers", icon: <FlightTakeoffIcon />, isActive: false },
  { text: "الحسابات", href: "/accounts", icon: <CalculateIcon />, isActive: false },
  { text: "الاعلانات", href: "/advertisements", icon: <CampaignIcon />, isActive: false },
/*   { text: "التقارير", href: "/reports", icon: <AssessmentIcon />, isActive: false }, */
  { text: "روابط صفحات التواصل", href: "/social-links", icon: <AssessmentIcon />, isActive: false },
  // { text: "الاعدادات", href: "/settings", icon: <SettingsIcon />, isActive: false },
];
