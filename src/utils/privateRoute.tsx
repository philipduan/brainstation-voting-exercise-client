import { Navigate } from "react-router-dom";

const PrivateRoute = (props: { children: React.ReactNode }): JSX.Element => {
  const { children } = props;
  const token = sessionStorage.getItem("token");

  return token ? <>{children}</> : <Navigate replace={true} to="/" />;
};

export default PrivateRoute;
