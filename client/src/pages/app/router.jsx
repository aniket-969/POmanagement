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
import POLayout from "../../layouts/POLayout.jsx";

// Pages
import LandingPage from "../LandingPage.jsx";
import { NotFound } from "../NotFound.jsx";
import Admin from "../admin/index.jsx";
import Approver from "../approver/index.jsx";
import User from "../user/index.jsx"
import RoleRedirect from "../../utils/RoleRedirect.jsx";
import ApproverReviewed from "../approver/review/index.jsx";
import ManageUsers from "../admin/users/index.jsx";
import PODetail from "../shared/index.jsx"

const Login = React.lazy(() => import("../auth/Login.jsx"));
const Register = React.lazy(() => import("../auth/Register.jsx"));

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
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
            </Route>

            {/* Protected routes */}
            <Route path="orders" element={<POLayout />}>
             <Route index element={<RoleRedirect />} /> 
              <Route path="admin" element={<Admin />} />
              <Route path="admin/users" element={<ManageUsers />} />
              <Route path="approver" element={<Approver />} />
              <Route path="approver/reviewed" element={<ApproverReviewed />} />
              <Route path="user" element={<User />} />
             <Route path="po/:id" element ={<PODetail/>}/>
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
