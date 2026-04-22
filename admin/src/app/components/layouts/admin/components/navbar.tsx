import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getUser, logout } from "../../../../services/auth.service";
import { useSidebar } from "../hooks/useSidebar";

export const Navbar = () => {
  const navigate = useNavigate();
  const { toggle } = useSidebar();
  const usuarioLogado = getUser()

  function manipularLogout() {
    logout();
    navigate("/");
  }

  return (
    <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark">
      <Link className="navbar-brand ps-3" to="/admin">
        Haniger
      </Link>

      <button
        className="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0"
        id="sidebarToggle"
        type="button"
        onClick={() => toggle()}
      >
        <i className="fas fa-bars"></i>
      </button>

      <ul className="navbar-nav d-none d-md-inline-block ms-auto me-0 me-md-3 my-2 my-md-0">
        <li className="nav-item dropdown">
          <button
            className="btn btn-link btn-sm nav-link dropdown-toggle"
            id="navbarDropdown"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="fas fa-user fa-fw" style={{ paddingRight: '4px' }}></i>
            <span style={{ paddingRight: '4px' }}>{usuarioLogado?.name}</span>
          </button>
          <ul
            className="dropdown-menu dropdown-menu-end"
            aria-labelledby="navbarDropdown"
          >
            <li>
              <Link className="dropdown-item" to="/admin/perfil">
                Configurações
              </Link>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => manipularLogout()}
              >
                Sair
              </button>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  );
};
