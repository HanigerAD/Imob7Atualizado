import { Link } from "react-router-dom";

export const Item = ({ label, to, color = "primary" }: { label: string, to: string, color?: string }) => (
  <div className={`card mb-4 border-${color}`}>
    <div className="card-body fw-bold fst-italic">{label}</div>
    <div className="card-footer d-flex align-items-center justify-content-between">
      <Link
        className="small stretched-link"
        to={to}
      >
        Ir para á página
      </Link>
      <div className="small">
        <i className="fas fa-angle-right"></i>
      </div>
    </div>
  </div>
)

export const DashboardPage = () => {
  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4">Painel</h1>
      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item active">Painel</li>
      </ol>

      <h3 className="mt-4">Geral</h3>

      <div className="row">
        <div className="col-xl-3 col-md-4"><Item to="/admin/corretores" label="Corretores" /></div>
        <div className="col-xl-3 col-md-4"><Item to="/admin/parceiros" label="Parceiros" /></div>
        <div className="col-xl-3 col-md-4"><Item to="/admin/imoveis" label="Imóveis" /></div>
        <div className="col-xl-3 col-md-4"><Item to="/admin/categorias" label="Categorias" /></div>
        <div className="col-xl-3 col-md-4"><Item to="/admin/postagens" label="Postagens" /></div>
      </div>

      <h3 className="mt-4">Localizacões</h3>

      <div className="row">
        <div className="col-xl-3 col-md-4"><Item to="/admin/cidades" label="Cidades" /></div>
        <div className="col-xl-3 col-md-4"><Item to="/admin/bairros" label="Bairros" /></div>
      </div>

      <h3 className="mt-4">Formulários do Site</h3>

      <div className="row">
        <div className="col-xl-3 col-md-4"><Item to="/admin/novos-imoveis" label="Novos Imoveis" /></div>
        <div className="col-xl-3 col-md-4"><Item to="/admin/mensagens" label="Mensagens" /></div>
      </div>

      <h3 className="mt-4">Configurações</h3>

      <div className="row">
        <div className="col-xl-3 col-md-4"><Item to="/admin/configuracoes" label="Site" /></div>
        <div className="col-xl-3 col-md-4"><Item to="/admin/usuarios" label="Usuários" /></div>
      </div>

    </div>
  );
};
