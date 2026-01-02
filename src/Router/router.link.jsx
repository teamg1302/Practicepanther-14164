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
import {
  ContactAddEdit,
  ContactsList,
  ContactMatters,
  ContactDetails,
} from "@/feature-module/pages/contacts";
import {
  MattersAddEdit,
  MattersList,
  MatterDetails,
} from "@/feature-module/pages/matters";
import {
  TimeEntriesList,
  AddEditTimeEntry,
  MultipleTimeEntries,
} from "@/feature-module/pages/time-entries";
import { CategoryList } from "@/feature-module/pages/categories";
import { ItemList } from "@/feature-module/pages/items";
import { ExpenseList, ExpenseAddEdit } from "@/feature-module/pages/expense";
import {
  FlatFeesList,
  FlatFeesAddEdit,
} from "@/feature-module/pages/flat-fees";
import { InvoicesList, InvoicesAddEdit } from "@/feature-module/pages/invoices";
import { SubscriptionSettings } from "@/feature-module/pages/settings/subscriptions";
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
    path: routes.headers?.[1]?.path,
    name: routes.headers?.[1]?.name,
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
    path: routes.editContact.path,
    name: routes.editContact.name,
    element: <ContactAddEdit />,
    route: Route,
  },
  {
    id: 6,
    path: routes.contactDetails.path,
    name: routes.contactDetails.name,
    element: <ContactDetails />,
    route: Route,
  },
  {
    id: 7,
    path: routes.contactMatters.path,
    name: routes.contactMatters.name,
    element: <ContactMatters />,
    route: Route,
  },
  {
    id: 6,
    path: routes.headers?.[2]?.path,
    name: routes.headers?.[2]?.name,
    element: <MattersList />,
    route: Route,
  },
  {
    id: 7,
    path: routes.addMatter.path,
    name: routes.addMatter.name,
    element: <MattersAddEdit />,
    route: Route,
  },
  {
    id: 8,
    path: routes.editMatter.path,
    name: routes.editMatter.name,
    element: <MattersAddEdit />,
    route: Route,
  },
  {
    id: 9,
    path: routes.matterDetails.path,
    name: routes.matterDetails.name,
    element: <MatterDetails />,
    route: Route,
  },
  {
    id: 9,
    path: routes.headers?.[3]?.path,
    name: routes.headers?.[3]?.name,
    element: <TimeEntriesList />,
    route: Route,
  },
  {
    id: 10,
    path: routes.addTimeEntry.path,
    name: routes.addTimeEntry.name,
    element: <AddEditTimeEntry />,
    route: Route,
  },
  {
    id: 11,
    path: routes.multipleTimeEntries.path,
    name: routes.multipleTimeEntries.name,
    element: <MultipleTimeEntries />,
    route: Route,
  },

  // Invoices
  {
    id: 12,
    path: routes.headers?.[4]?.children?.[0]?.path,
    name: routes.headers?.[4]?.children?.[0]?.name,
    element: <InvoicesList />,
    route: Route,
  },
  {
    id: 12,
    path: routes.addInvoice.path,
    name: routes.addInvoice.name,
    element: <InvoicesAddEdit />,
    route: Route,
  },
  {
    id: 12,
    path: routes.editInvoice.path,
    name: routes.editInvoice.name,
    element: <InvoicesAddEdit />,
    route: Route,
  },

  {
    id: 12,
    path: routes.headers?.[4]?.children?.[1]?.path,
    name: routes.headers?.[4]?.children?.[1]?.name,
    element: <ExpenseList />,
    route: Route,
  },
  {
    id: 13,
    path: routes.addExpense.path,
    name: routes.addExpense.name,
    element: <ExpenseAddEdit />,
    route: Route,
  },
  {
    id: 14,
    path: routes.editExpense.path,
    name: routes.editExpense.name,
    element: <ExpenseAddEdit />,
    route: Route,
  },
  {
    id: 15,
    path: routes.headers?.[4]?.children?.[2]?.path,
    name: routes.headers?.[4]?.children?.[2]?.name,
    element: <FlatFeesList />,
    route: Route,
  },
  {
    id: 16,
    path: routes.addFlatFee.path,
    name: routes.addFlatFee.name,
    element: <FlatFeesAddEdit />,
    route: Route,
  },
  {
    id: 17,
    path: routes.editFlatFee.path,
    name: routes.editFlatFee.name,
    element: <FlatFeesAddEdit />,
    route: Route,
  },

  // {
  //   id: 13,
  //   path: routes.headers?.[4]?.children?.[1]?.path,
  //   name: routes.headers?.[4]?.children?.[1]?.name,
  //   element: <FlatFeesList />,
  //   route: Route,
  // },
  {
    id: 18,
    path: routes.headers?.[4]?.children?.[3]?.path,
    name: routes.headers?.[4]?.children?.[3]?.name,
    element: <CategoryList />,
    route: Route,
  },
  {
    id: 19,
    path: routes.headers?.[4]?.children?.[4]?.path,
    name: routes.headers?.[4]?.children?.[4]?.name,
    element: <ItemList />,
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
    path: routes.editRolePermission.path,
    name: routes.editRolePermission.name,
    element: <RolePermissionAddEdit />,
    route: Route,
  },
  {
    id: 8,
    path: routes.addRolePermission.path,
    name: routes.addRolePermission.name,
    element: <RolePermissionAddEdit />,
    route: Route,
  },
  {
    id: 9,
    path: routes.editUserPermissions.path,
    name: routes.editUserPermissions.name,
    element: <RolePermissionAddEdit />,
    route: Route,
  },
  {
    id: 10,
    path: routes.editUser.path,
    name: routes.editUser.name,
    element: <PersonalSettings />,
    route: Route,
  },
  {
    id: 10,
    path: routes.addUser.path,
    name: routes.addUser.name,
    element: <PersonalSettings />,
    route: Route,
  },
  {
    id: 11,
    path: routes.settings[2].children[0].path,
    name: routes.settings[2].children[0].name,
    element: <SubscriptionSettings />,
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
