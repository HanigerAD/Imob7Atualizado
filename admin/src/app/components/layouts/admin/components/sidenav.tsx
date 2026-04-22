import { useState } from "react";
import { Link } from "react-router-dom";

interface RenderLinkProps {
  to: string;
  label: string;
}

const RenderLink: React.FC<RenderLinkProps> = ({ to, label }) => {
  return (
    <Link className="nav-link" to={to}>
      {label}
    </Link>
  );
};

interface RenderDropdownProps {
  label: string;
  children?: React.ReactNode;
}

const RenderDropdown: React.FC<RenderDropdownProps> = ({ label, children }) => {
  const [show, setShow] = useState(false);

  const toggle = () => {
    setShow((show) => !show);
  };

  return (
    <>
      <button
        className={`btn btn-link nav-link ${!show ? "collapsed" : ""}`}
        type="button"
        onClick={() => toggle()}
      >
        {label}
        <div className="sb-sidenav-collapse-arrow">
          <i className="fas fa-angle-down"></i>
        </div>
      </button>

      <div className={`collapse ${!show ? "" : "show"}`}>
        <nav className="sb-sidenav-menu-nested nav">{children}</nav>
      </div>
    </>
  );
};

export const Sidenav = () => {
  return (
    <div id="layoutSidenav_nav">
      <nav
        className="sb-sidenav accordion sb-sidenav-dark"
        id="sidenavAccordion"
      >
        <div className="sb-sidenav-menu">
          <div className="nav">
            <RenderLink to="/admin" label="Painel" />
            <RenderLink to="/admin/corretores" label="Corretores" />
            <RenderLink to="/admin/parceiros" label="Parceiros" />
            <RenderLink to="/admin/imoveis" label="Imóveis" />
            <RenderLink to="/admin/categorias" label="Categorias" />
            <RenderDropdown label="Localizacões">
              <RenderLink to="/admin/cidades" label="Cidades" />
              <RenderLink to="/admin/bairros" label="Bairros" />
            </RenderDropdown>
            <RenderLink to="/admin/postagens" label="Postagens" />
            <RenderDropdown label="Formulários do Site">
              <RenderLink to="/admin/novos-imoveis" label="Novos Imoveis" />
              <RenderLink to="/admin/mensagens" label="Mensagens" />
            </RenderDropdown>
            <RenderDropdown label="Configurações">
              <RenderLink to="/admin/configuracoes" label="Site" />
              <RenderLink to="/admin/usuarios" label="Usuários" />
            </RenderDropdown>
          </div>
        </div>

        <div className="sb-sidenav-footer">
          <div className="small">Copyright &copy; Haniger 2023</div>
        </div>
      </nav>
    </div>
  );
};
