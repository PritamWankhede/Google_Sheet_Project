import { lazy } from "react";
import { Navigate, useRoutes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

const AuthLayout = lazy(() => import("@/layouts/AuthLayout"));
const SignIn = lazy(() => import("@/pages/SignIn"));
const SignUp = lazy(() => import("@/pages/SignUp"));

const SheetsDetail = lazy(() => import("@/pages/SheetDetail"));
const SheetsList = lazy(() => import("@/pages/SheetList"));

const PageNotFound = lazy(() => import("@/pages/NotFound"));

const routes = [
  {
    path: "",
    element: <Navigate to="/auth/sign-in" replace />,
  },
  {
    path: "auth",
    element: <AuthLayout />,
    children: [
      {
        path: "sign-in",
        element: (
          <ProtectedRoute isAuthenticated={false} redirectIfLogin>
            <SignIn />
          </ProtectedRoute>
        ),
      },
      {
        path: "sign-up",
        element: (
          <ProtectedRoute isAuthenticated={false} redirectIfLogin>
            <SignUp />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "sheet/list",
    element: (
      <ProtectedRoute>
        <SheetsList />
      </ProtectedRoute>
    ),
  },
  {
    path: "sheet/:sheetId",
    element: (
      <ProtectedRoute>
        <SheetsDetail />
      </ProtectedRoute>
    ),
  },
  { path: "*", element: <PageNotFound /> },
];

export const Router = () => {
  return useRoutes(routes);
};

export default Router;
