import { useState } from "react"
import { getUser } from "../services/auth.service";

export const PERMISSIONS = {
  GESTAO_DE_IMOVEIS: "Gestão de imóveis",
  INFORMACOES_PRIVADAS: "Informações privadas",
  GESTAO_DE_USUARIOS: "Gestão de usuários",
  GESTAO_DE_CONTEUDO: "Gestão de conteúdo",
}

export const useVerifyPermission = (permission: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState<null | boolean>(null);

  const verifyPermission = async () => {
    setIsLoading(true);

    const user = getUser();

    if (user) {
      const found = user.permission.findIndex(({ description }: any) => description == permission) >= 0

      setHasPermission(found);
    } else {
      setHasPermission(false);
    }

    setIsLoading(false);
  }

  return { isLoading, hasPermission, verifyPermission }
}