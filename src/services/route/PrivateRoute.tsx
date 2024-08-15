import { Navigate } from "react-router-dom";

export const PrivateRoute = ({ auth , children }) => {

  return auth === "authenticated" ? children : (<Navigate to="/login" />);
};