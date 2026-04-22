import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { apiService } from "../../../services/api.service";
import { getToken, login } from "../../../services/auth.service";

export const LoginPage = () => {
  const navigate = useNavigate();

  const [model, setModel] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  function atualizarModel(chave: string, valor: any) {
    setModel((modelAnt) => ({ ...modelAnt, [chave]: valor }));
  }

  async function manipularEnvio(event: any) {
    event.preventDefault();

    if (!model.email || !model.password) {
      setMessage("Preencha todos os dados do formulário");
      toast.error("Preencha todos os dados do formulário");
    } else {
      entrar();
    }
  }

  async function entrar() {
    try {
      const resposta = await apiService.post("/auth/login", {
        email: model.email,
        password: model.password,
      });

      login(resposta.data.token, resposta.data.user);
      toast.success("Usuário autenticado");
      navigate("/admin", { replace: true });
    } catch (error) {
      setMessage("Houve um problema com o login, verifique suas credenciais.");
      toast.error("Houve um problema com o login, verifique suas credenciais.");
    }
  }

  async function verificarToken(token: string) {
    try {
      await apiService.get("/auth/token-verify");
      navigate("/admin", { replace: true });
    } catch (error) {
      setMessage("Sessão expirada");
      toast.error("Sessão expirada");
    }
  }

  useEffect(() => {
    const token = getToken();

    if (token) {
      verificarToken(token);
    }
  }, []);

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-5">
          <div className="card shadow-lg border-0 rounded-lg mt-5">
            <div className="card-body">
              <form onSubmit={manipularEnvio}>
                <div className="form-floating mb-3">
                  <input
                    className="form-control"
                    id="inputEmail"
                    type="email"
                    placeholder="name@example.com"
                    value={model.email}
                    onChange={(event) =>
                      atualizarModel("email", event.target.value)
                    }
                  />
                  <label htmlFor="inputEmail">E-mail</label>
                </div>
                <div className="form-floating mb-3">
                  <input
                    className="form-control"
                    id="inputPassword"
                    type="password"
                    placeholder="Password"
                    value={model.password}
                    onChange={(event) =>
                      atualizarModel("password", event.target.value)
                    }
                  />
                  <label htmlFor="inputPassword">Senha</label>
                </div>

                {message ? (
                  <div className="alert alert-danger" role="alert">
                    {message}
                  </div>
                ) : null}

                <div className="d-flex align-items-center justify-content-between mt-4 mb-0">
                  <div className="small"></div>
                  <button className="btn btn-primary" type="submit">
                    Entrar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
