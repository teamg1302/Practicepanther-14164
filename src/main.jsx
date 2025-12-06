import React from "react";
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.js";
import { base_path } from "@/environment.jsx";
import "@/style/css/feather.css";
import "@/style/css/line-awesome.min.css";
import "@/style/scss/main.scss";
import "@/style/icons/fontawesome/css/fontawesome.min.css";
import "@/style/icons/fontawesome/css/all.min.css";
import "@/core/i18n/config";
import store, { persistor } from "@/core/redux/store.jsx";
import AllRoutes from "@/Router/router.jsx";

const rootElement = document.getElementById("root");

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <BrowserRouter
            basename={base_path}
            future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
          >
            <AllRoutes />
          </BrowserRouter>
        </PersistGate>
      </Provider>
    </React.StrictMode>
  );
} else {
  console.error("Element with id 'root' not found.");
}
