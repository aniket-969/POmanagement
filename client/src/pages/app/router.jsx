import React, { useMemo } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route, 
  Outlet,
} from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

// Layouts
import Layout from "../../layouts/Layout.jsx";
import AuthLayout from "../../layouts/AuthLayout";


// Pages
import LandingPage from "../LandingPage.jsx";
import { NotFound } from "../NotFound.jsx";

// const Login = React.lazy(() => import("../auth/Login.jsx"));
// const Register = React.lazy(() => import("../auth/Register.jsx"));

export const AppRouter = () => {
  const queryClient = useQueryClient();

  const router = useMemo(
    () =>
      createBrowserRouter(
        createRoutesFromElements(
          <Route path="/" element={<Layout />}>
            {/* Landing */}
            <Route index element={<LandingPage />} />

            {/* Auth */}
            <Route element={<AuthLayout />}>
              {/* <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} /> */}
            </Route>

            
            {/* Fallback */}
            <Route path="*" element={<NotFound />} />
          </Route>
        )
      ),
    [queryClient]
  );

  return <RouterProvider router={router} />;
};
