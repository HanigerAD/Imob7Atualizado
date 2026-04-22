import { Routes as RrdRoutes, Route } from "react-router-dom";
import { AdminLayout } from "../components/layouts/admin/admin-layout";
import { GuestLayout } from "../components/layouts/guest/guest-layout";
import { BairroPage } from "../components/pages/bairros/bairro-page";
import { BairrosPage } from "../components/pages/bairros/bairros-page";
import { CategoriaPage } from "../components/pages/categorias/categoria-page";
import { CategoriasPage } from "../components/pages/categorias/categorias-page";
import { CidadePage } from "../components/pages/cidades/cidade-page";
import { CidadesPage } from "../components/pages/cidades/cidades-page";
import { ConfiguracoesPage } from "../components/pages/configuracoes/configuracoes-page";
import { CorretorPage } from "../components/pages/corretores/corretor-page";
import { CorretoresPage } from "../components/pages/corretores/corretores-page";
import { DashboardPage } from "../components/pages/dashboard/dashboard-page";
import { ImoveisPage } from "../components/pages/imoveis/imoveis-page";
import { ImovelPage } from "../components/pages/imoveis/imovel-page";
import { LoginPage } from "../components/pages/login/login-page";
import { MensagemPage } from "../components/pages/mensagens/mensagem-page";
import { MensagensPage } from "../components/pages/mensagens/mensagens-page";
import { NovoImovelPage } from "../components/pages/novos-imoveis/novo-imovel-page";
import { NovosImoveisPage } from "../components/pages/novos-imoveis/novos-imoveis-page";
import { ParceiroPage } from "../components/pages/parceiros/parceiro-page";
import { ParceirosPage } from "../components/pages/parceiros/parceiros-page";
import { PerfilPage } from "../components/pages/perfil/perfil-page";
import { PostagemPage } from "../components/pages/postagens/postagem-page";
import { PostagensPage } from "../components/pages/postagens/postagens-page";
import { UsuarioPage } from "../components/pages/usuarios/usuario-page";
import { UsuariosPage } from "../components/pages/usuarios/usuarios-page";

export const Routes = () => (
  <RrdRoutes>
    <Route path="/" element={<GuestLayout />}>
      <Route index element={<LoginPage />} />
    </Route>

    <Route path="admin" element={<AdminLayout />}>
      <Route index element={<DashboardPage />} />
      <Route path="imoveis/cadastrar" element={<ImovelPage />} />
      <Route path="imoveis/:code" element={<ImovelPage />} />
      <Route path="imoveis" element={<ImoveisPage />} />
      <Route path="postagens/cadastrar" element={<PostagemPage />} />
      <Route path="postagens/:code" element={<PostagemPage />} />
      <Route path="postagens" element={<PostagensPage />} />
      <Route path="corretores/cadastrar" element={<CorretorPage />} />
      <Route path="corretores/:code" element={<CorretorPage />} />
      <Route path="corretores" element={<CorretoresPage />} />
      <Route path="parceiros/cadastrar" element={<ParceiroPage />} />
      <Route path="parceiros/:code" element={<ParceiroPage />} />
      <Route path="parceiros" element={<ParceirosPage />} />
      <Route path="configuracoes" element={<ConfiguracoesPage />} />
      <Route path="cidades/cadastrar" element={<CidadePage />} />
      <Route path="cidades/:code" element={<CidadePage />} />
      <Route path="cidades" element={<CidadesPage />} />
      <Route path="bairros/cadastrar" element={<BairroPage />} />
      <Route path="bairros/:code" element={<BairroPage />} />
      <Route path="bairros" element={<BairrosPage />} />
      <Route path="categorias/cadastrar" element={<CategoriaPage />} />
      <Route path="categorias/:code" element={<CategoriaPage />} />
      <Route path="categorias" element={<CategoriasPage />} />
      <Route path="perfil" element={<PerfilPage />} />
      <Route path="novos-imoveis/cadastrar" element={<NovoImovelPage />} />
      <Route path="novos-imoveis/:code" element={<NovoImovelPage />} />
      <Route path="novos-imoveis" element={<NovosImoveisPage />} />
      <Route path="mensagens/cadastrar" element={<MensagemPage />} />
      <Route path="mensagens/:code" element={<MensagemPage />} />
      <Route path="mensagens" element={<MensagensPage />} />
      <Route path="usuarios/cadastrar" element={<UsuarioPage />} />
      <Route path="usuarios/:code" element={<UsuarioPage />} />
      <Route path="usuarios" element={<UsuariosPage />} />
    </Route>
  </RrdRoutes>
);
