import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Header from "@/InitialPage/Sidebar/Header";
import Sidebar from "@/InitialPage/Sidebar/Sidebar";
import { pagesRoute, publicRoutes, settingsRoutes } from "@/Router/router.link";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import ThemeSettings from "@/InitialPage/themeSettings";
import ProtectedRoute from "@/Router/ProtectedRoute";
import SettingsLayout from "@/InitialPage/SettingsLayout";

const HeaderLayout = () => {
  const data = useSelector((state) => state.toggle_header);
  return (
    <ProtectedRoute>
      <div className={`main-wrapper ${data ? "header-collapse" : ""}`}>
        {/* <Loader /> */}
        <Header />
        <Sidebar />
        <Outlet />
        <ThemeSettings />
      </div>
    </ProtectedRoute>
  );
};

const Authpages = () => {
  const data = useSelector((state) => state.toggle_header);
  const token = useSelector((state) => state.auth?.token);
  if (token) {
    return <Navigate to="/" replace />;
  }
  return (
    <div className={data ? "header-collapse" : ""}>
      <Outlet />
      {/* <Loader /> */}
      <ThemeSettings />
    </div>
  );
};

const AllRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path={"/"} element={<HeaderLayout />}>
          {publicRoutes.map((route, id) => (
            <Route path={route.path} element={route.element} key={id} />
          ))}
          <Route path="/settings" element={<SettingsLayout />}>
            {settingsRoutes.map((route, id) => (
              <Route path={route.path} element={route.element} key={id} />
            ))}
          </Route>
        </Route>

        <Route path={"/"} element={<Authpages />}>
          {pagesRoute.map((route, id) => (
            <Route path={route.path} element={route.element} key={id} />
          ))}
        </Route>
      </Routes>
    </div>
  );
};
export default AllRoutes;
