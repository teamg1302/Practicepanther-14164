import React from "react";
import { Route } from "react-router-dom";

import Dashboard from "@/feature-module/dashboard/Dashboard";
import Signin from "@/feature-module/pages/login/signin";
import Forgotpassword from "@/feature-module/pages/forgotpassword/forgotpassword";
import Resetpassword from "@/feature-module/pages/resetpassword/resetpassword";
import Verifytoken from "@/feature-module/pages/verifytoken/verifytoken";
import Error404 from "@/feature-module/pages/errorpages/error404";
import Error500 from "@/feature-module/pages/errorpages/error500";
import Comingsoon from "@/feature-module/pages/comingsoon";
import Undermaintainence from "@/feature-module/pages/undermaintainence";
import PersonalSettings from "@/feature-module/pages/settings/personal-settings";
import FirmLogoInfoSettings from "@/feature-module/pages/settings/firm-logo-info";
import UsersSettings from "@/feature-module/pages/settings/users";
import RolePermissionList from "@/feature-module/pages/settings/roles-permissions";
import RolePermissionAddEdit from "@/feature-module/pages/settings/roles-permissions/AddEdit";
import RecycleBin from "@/feature-module/pages/settings/recyclebin";
import SecuritySettings from "@/feature-module/pages/settings/security";
import { ContactAddEdit, ContactsList } from "@/feature-module/pages/contacts";
import { MattersAddEdit, MattersList } from "@/feature-module/pages/matters";
import { all_routes } from "./all_routes";

const routes = all_routes;

export const publicRoutes = [
  {
    id: 1,
    path: routes.base_path,
    name: "base_path",
    element: <Dashboard />,
    route: Route,
  },
  {
    id: 2,
    path: routes.headers[0].path,
    name: routes.headers[0].name,
    element: <Dashboard />,
    route: Route,
  },
  {
    id: 3,
    path: routes.headers[1].path,
    name: routes.headers[1].name,
    element: <ContactsList />,
    route: Route,
  },
  {
    id: 4,
    path: routes.addContact.path,
    name: routes.addContact.name,
    element: <ContactAddEdit />,
    route: Route,
  },
  {
    id: 5,
    path: routes.headers[2].path,
    name: routes.headers[2].name,
    element: <MattersList />,
    route: Route,
  },
  {
    id: 6,
    path: routes.addMatter.path,
    name: routes.addMatter.name,
    element: <MattersAddEdit />,
    route: Route,
  },
  {
    id: 7,
    path: routes.editMatter.path,
    name: routes.editMatter.name,
    element: <MattersAddEdit />,
    route: Route,
  },
];

export const settingsRoutes = [
  {
    id: 1,
    path: routes.settings[0].path, // Relative path - will be /settings/personal when nested under /settings
    name: routes.settings[0].name,
    element: <PersonalSettings />,
    route: Route,
  },
  {
    id: 2,
    path: routes.settings[0].children[1].path,
    name: routes.settings[0].children[1].name,
    element: <SecuritySettings />,
    route: Route,
  },
  {
    id: 3,
    path: routes.settings[0].children[2].path,
    name: routes.settings[0].children[2].name,
    element: <FirmLogoInfoSettings />,
    route: Route,
  },
  {
    id: 4,
    path: routes.settings[0].children[3].path,
    name: routes.settings[0].children[3].name,
    element: <RecycleBin />,
    route: Route,
  },
  {
    id: 5,
    path: routes.settings[1].children[0].path,
    name: routes.settings[1].children[0].name,
    element: <UsersSettings />,
    route: Route,
  },
  {
    id: 6,
    path: routes.settings[1].children[1].path,
    name: routes.settings[1].children[1].name,
    element: <RolePermissionList />,
    route: Route,
  },
  {
    id: 7,
    path: routes.editRolePermission,
    name: "editRolePermission",
    element: <RolePermissionAddEdit />,
    route: Route,
  },
  {
    id: 8,
    path: routes.addRolePermission,
    name: "addRolePermission",
    element: <RolePermissionAddEdit />,
    route: Route,
  },
  {
    id: 9,
    path: routes.editUser,
    name: "editUser",
    element: <PersonalSettings />,
    route: Route,
  },
  {
    id: 10,
    path: routes.addUser,
    name: "addUser",
    element: <PersonalSettings />,
    route: Route,
  },
];

export const pagesRoute = [
  {
    id: 1,
    path: routes.signin,
    name: "signin",
    element: <Signin />,
    route: Route,
  },
  {
    id: 7,
    path: routes.forgotPassword,
    name: "forgotPassword",
    element: <Forgotpassword />,
    route: Route,
  },
  {
    id: 9,
    path: routes.resetpassword,
    name: "resetpassword",
    element: <Resetpassword />,
    route: Route,
  },
  {
    id: 14,
    path: routes.verifyToken,
    name: "verifyToken",
    element: <Verifytoken />,
    route: Route,
  },
  {
    id: 15,
    path: routes.verifyTokenTwo,
    name: "verifyTokenTwo",
    element: <Verifytoken />,
    route: Route,
  },
  {
    id: 20,
    path: routes.error404,
    name: "error404",
    element: <Error404 />,
    route: Route,
  },
  {
    id: 21,
    path: routes.error500,
    name: "error500",
    element: <Error500 />,
    route: Route,
  },
  {
    id: 22,
    path: routes.comingsoon,
    name: "comingsoon",
    element: <Comingsoon />,
    route: Route,
  },
  {
    id: 23,
    path: routes.undermaintenance,
    name: "undermaintenance",
    element: <Undermaintainence />,
    route: Route,
  },
];
