import { useState } from "react";
import { toast } from "react-toastify";
import { apiService } from "../services/api.service";

export const useCategories = (initialState = []) => {
  const [categories, setCategories] = useState(initialState);

  async function buscarCategorias() {
    setCategories([]);

    try {
      const resposta = await apiService.get(`/property/categories`);
      setCategories(resposta.data);
    } catch (error) {
      console.log({ error });
      toast.error("Houve um erro ao buscar as Categorias de Imovel.");
    }
  }

  return { categories, setCategories, buscarCategorias };
};
