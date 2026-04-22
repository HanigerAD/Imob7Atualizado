import { Outlet } from "react-router-dom";

export const GuestLayout = () => {
  return (
    <div className="root-layout" style={{ backgroundColor: '#233492' }}>
      <div id="layoutAuthentication">
        <div id="layoutAuthentication_content">
          <main>
            <Outlet />
          </main>
        </div>
        <div id="layoutAuthentication_footer">
          <footer className="py-4 bg-light mt-auto">
            <div className="container-fluid px-4">
              <div className="d-flex align-items-center justify-content-between small">
                <div className="text-muted">Copyright &copy; Haniger 2022</div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};
