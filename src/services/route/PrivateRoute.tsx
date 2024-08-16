import { ReactElement } from "react";
import { Navigate } from "react-router-dom";

interface SettingsPrivateRoute{
  auth: unknown,
  children: ReactElement
}

export const PrivateRoute = ({auth, children}: SettingsPrivateRoute) => {
  return auth === "authenticated" ? children : (<Navigate to="/login" />);
};