import { useState } from "react";
import { toast } from "react-toastify";
import { apiService } from "../services/api.service";

export const useTypes = (initialState = []) => {
  const [types, setTypes] = useState(initialState);

  async function buscarTiposDeImovel() {
    setTypes([]);

    try {
      const resposta = await apiService.get(`/property/types`);
      setTypes(resposta.data);
    } catch (error) {
      console.log({ error });
      toast.error("Houve um erro ao buscar os Tipos de Imovel.");
    }
  }

  return { types, setTypes, buscarTiposDeImovel };
};
