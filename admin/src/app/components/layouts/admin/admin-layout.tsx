import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../../../services/auth.service";
import { updateLocalUser } from "../../../services/user.service";
import { Navbar } from "./components/navbar";
import { Sidenav } from "./components/sidenav";
import { SidebarProvider, useSidebar } from "./hooks/useSidebar";

const Layout = () => {
  const { toggled } = useSidebar();

  return (
    <div className={`sb-nav-fixed ${toggled ? "sb-sidenav-toggled" : ""}`}>
      <Navbar />
      <div id="layoutSidenav">
        <Sidenav />
        <div id="layoutSidenav_content">
          <main>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export const AdminLayout = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const init = async () => {
      const authenticated = isAuthenticated();

      if (authenticated) {
        try {
          await updateLocalUser()
          setIsAuth(true);
        } catch (error) {
          setIsAuth(false);
        }
      } else {
        setIsAuth(false);
      }

      setIsLoading(false);
    }

    init();
  }, []);


  if (isLoading) {
    return <div>Carregando...</div>
  }

  return !isAuth ? (
    <Navigate to={{ pathname: "/" }} />
  ) : (
    <SidebarProvider>
      <Layout />
    </SidebarProvider>
  );
};
