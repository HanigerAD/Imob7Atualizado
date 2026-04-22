import { toast } from 'react-toastify';
import { apiService } from './api.service';
import { getToken, getUser, login } from './auth.service'

export const updateLocalUser = async () => {
  const localUser = getUser()
  const token = getToken()

  if (localUser && token) {
    try {
      const resposta = await apiService.get(`/user/users/${localUser?.code}`);

      const user = Object.assign({}, resposta.data);

      login(token, user);
    } catch (error) {
      console.log({ error });
      toast.error("Houve um erro ao buscar o Usuário.");
      throw new Error("Houve um erro ao buscar o Usuário.");
    }
  }
}