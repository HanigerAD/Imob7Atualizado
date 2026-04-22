import { getUser } from "../../../services/auth.service";
import { UsuarioPage } from "../usuarios/usuario-page";

export const PerfilPage = () => {
  const usuarioLogado = getUser()

  return UsuarioPage({ backPage: '/admin', userCode: usuarioLogado?.code })
};
