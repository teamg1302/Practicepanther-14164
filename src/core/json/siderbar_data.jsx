import React from "react";

import * as Icon from "react-feather";

export const SidebarData = [
  {
    label: "Main",
    submenuOpen: true,
    showSubRoute: false,
    submenuHdr: "Main",
    submenuItems: [
      {
        label: "Dashboard",
        icon: <Icon.Grid />,
        link: "/dashboard",
        showSubRoute: false,
        submenu: false,
        module: "manage_dashboard",
        permission: "read",
      },
    ],
  },
  {
    label: "Settings",
    submenu: true,
    showSubRoute: false,
    submenuHdr: "Settings",
    submenuItems: [
      {
        label: "Personal Settings",
        link: "/settings/personal",
        icon: <Icon.Settings />,
        showSubRoute: false,
        submenu: false,
        module: "manage_settings",
        permission: "read",
      },
      {
        label: "Security",
        link: "/settings/security",
        icon: <Icon.Lock />,
        showSubRoute: false,
        submenu: false,
        module: "manage_settings",
        permission: "read",
      },
      {
        label: "Firm Logo & Info",
        link: "/settings/firm-logo-info",
        icon: <Icon.Info />,
        showSubRoute: false,
        submenu: false,
        module: "manage_settings",
        permission: "read",
      },
      {
        label: "Recycle Bin",
        link: "/settings/recycle-bin",
        icon: <Icon.Trash2 />,
        showSubRoute: false,
        submenu: false,
        module: "manage_recycle_bin",
        permission: "read",
      },
      {
        label: "Team Members",
        link: "/settings/users",
        icon: <Icon.Users />,
        showSubRoute: false,
        submenu: false,
        module: "manage_users",
        permission: "read",
      },
      {
        label: "Roles & Permissions",
        link: "/settings/roles-permissions",
        icon: <Icon.Lock />,
        showSubRoute: false,
        submenu: false,
        module: "manage_users_role",
        permission: "read",
      },
      {
        label: "Subscriptions",
        link: "/settings/subscriptions",
        icon: <Icon.CreditCard />,
        showSubRoute: false,
        submenu: false,
        module: "manage_subscriptions",
        permission: "read",
      },
    ],
  },
];
