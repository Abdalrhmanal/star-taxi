import { JSX } from "@emotion/react/jsx-runtime";
import { ExpandLess, ExpandMore, Home, Settings, People, Comment, Business, Subscriptions } from "@mui/icons-material";

export interface MenuItem {
  text: string;
  href: string;
  icon: JSX.Element;
  isActive: boolean;
  isExpanded?: boolean;
  children?: MenuItem[];
}

export const menuItems: MenuItem[] = [
  { text: "الصفحة الرئيسية", href: "/", icon: <Home />, isActive: false },
  {
    text: "Company details",
    href: "",
    icon: <Business />,
    isActive: false,
    isExpanded: false,
    children: [
      { text: "Add new company", href: "/companies/add-company", icon: <Business />, isActive: false },
      { text: "All companies", href: "/companies", icon: <Business />, isActive: false },
    ],
  },
  { text: "Subscription information", href: "/subscriptions", icon: <Subscriptions />, isActive: false },
  { text: "Comments", href: "/comments", icon: <Comment />, isActive: false },
  {
    text: "Details subscriptions",
    href: "",
    icon: <Subscriptions />,
    isActive: false,
    isExpanded: false,
    children: [
      { text: "Add new subscription", href: "/add-subscription", icon: <Subscriptions />, isActive: false },
      { text: "All subscriptions", href: "/all-subscriptions", icon: <Subscriptions />, isActive: false },
    ],
  },
  { text: "Users", href: "/users", icon: <People />, isActive: false },
  { text: "Settings", href: "/settings", icon: <Settings />, isActive: false },
];
