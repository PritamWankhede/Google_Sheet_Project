import { Fragment } from "react";
import { Navigate } from "react-router-dom";
import { cookie } from "@/utils";

const ProtectedRoute = ({ children, isAuthenticated = true, redirectIfLogin = false }) => {
  const authToken = cookie.get("auth_token");

  if (authToken && redirectIfLogin) {
    return <Navigate replace to="/sheet/list" />;
  }

  if (isAuthenticated && !authToken) {
    return <Navigate replace to="/auth/sign-in" />;
  }

  return <Fragment>{children}</Fragment>;
};

export default ProtectedRoute;
