import { useEffect } from "react";
import { useAuth } from "../providers/Auth";
import withAuth from "../hocs/withAuth";

export default withAuth(function Logout() {
  const { setAuthenticated, setUsertype } = useAuth();
  useEffect(() => {
    async function doLogout() {
      const response = await fetch("/api/logout");
      if (response.status === 200) {
        setAuthenticated(false);
        setUsertype(null);
      } else {
        console.error("Failed to logout", response);
      }
    }
    doLogout();
  }, [setAuthenticated]);
  return <></>;
}, "/login");
