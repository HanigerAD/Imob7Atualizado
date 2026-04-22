import _ from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { apiService } from "../../../services/api.service";
import { ObjectHelper } from "../../../helpers/object.helper";
import Input from "../../shared/input-generico";
import { AutocompleteGenerico } from "../../shared/autocomplete/autocomplete-generico";
import { SeletorBooleanoGenerico } from "../../shared/seletor-booleano-generico";
import {
  PERMISSIONS,
  useVerifyPermission,
} from "../../../hooks/useVerifyPermission";

export const UsuarioPage: React.FC<{
  backPage?: string;
  userCode?: string;
}> = ({ backPage = `/admin/usuarios`, userCode }) => {
  const navigate = useNavigate();
  const params = useParams();
  const modelId = params.code || userCode || null;
  const [model, setModel] = useState({} as any);
  const [senhaConfirmacao, setsenhaConfirmacao] = useState("");
  const [habilitarCamposSenha, setHabilitarCamposSenha] = useState(!modelId);
  const [permissoes, setPermissoes] = useState([] as any[]);
  const [modelAnt, setModelAnt] = useState({} as any);
  const [carregando, setCarregando] = useState(false);
  const { hasPermission, verifyPermission } = useVerifyPermission(
    PERMISSIONS.GESTAO_DE_USUARIOS
  );

  const novoCadastro = useMemo(() => {
    return model.code ? false : true;
  }, [model]);

  const edicaoDeUsuarioLogado = useMemo(() => {
    return model.code === modelId ? true : false;
  }, [model.code, modelId]);

  const usuarioPodeEditar = useMemo(() => {
    return novoCadastro || edicaoDeUsuarioLogado || hasPermission;
  }, [edicaoDeUsuarioLogado, hasPermission, novoCadastro]);

  function atualizarModel(chave: string, valor: any) {
    setModel((modelAnt: any) => ({ ...modelAnt, [chave]: valor }));
  }

  async function cancelar(event: any) {
    event.preventDefault();

    navigate(backPage);
  }

  async function manipularEnvio(event: any) {
    event.preventDefault();

    try {
      await salvar(model);
    } catch (error) {
      console.log({ error });
      setCarregando(false);
    }
  }

  function removeCamposSalvar(data: any) {
    let newModel = Object.assign({}, data);

    newModel = ObjectHelper.mantemSomenteCampos(newModel, [
      "name",
      "email",
      "situation",
      "permission",
    ]);

    newModel.situation = newModel.situation
      ? ObjectHelper.mantemSomenteCampos(newModel.situation, ["code"])
      : null;
    newModel.situation = newModel.situation ? newModel.situation.code : null;

    newModel.permission = newModel.permission
      ? newModel.permission.map((permission: any) => {
          const { code } = ObjectHelper.mantemSomenteCampos(permission, [
            "code",
          ]);
          return code;
        })
      : [];

    return newModel;
  }

  async function salvarUsuario(data: any) {
    const password = data.password;
    const newModel = removeCamposSalvar(data);
    let code = modelId || "";

    if (code) {
      await apiService.patch(`/user/users/${code}`, newModel);

      if (habilitarCamposSenha) {
        await apiService.patch(`/user/users/${code}/update-password`, {
          password,
        });
      }
    } else {
      const newModelComSenha = { ...newModel, password };
      const resposta = await apiService.post(`/user/users`, newModelComSenha);

      code = resposta.data[0];
    }

    return code;
  }

  async function salvar(data: any) {
    setCarregando(true);

    try {
      let code = await salvarUsuario(data);

      toast.success("Registro salvo com sucesso");
      setCarregando(false);

      if (code != modelId) {
        navigate(`/admin/usuarios/${code}`);
      } else {
        buscar(code);
      }
    } catch (error) {
      console.log({ error });
      toast.error(
        "Houve um erro ao salvar o Usuário. Verifique se os campos foram preenchidos corretamente"
      );
      setCarregando(false);
    }
  }

  async function buscarPermissoes() {
    setCarregando(true);

    try {
      const resposta = await apiService.get(`/user/permissions`);
      setPermissoes(resposta.data);
      setCarregando(false);
    } catch (error) {
      console.log({ error });
      toast.error("Houve um erro ao buscar as permissoes.");
      setCarregando(false);
    }
  }

  async function buscar(modelId: string) {
    setCarregando(true);
    setModel({});

    try {
      const resposta = await apiService.get(`/user/users/${modelId}`);

      const newModel = Object.assign({}, resposta.data);

      setModelAnt(newModel);
      setModel(newModel);

      setCarregando(false);
    } catch (error) {
      console.log({ error });
      toast.error("Houve um erro ao buscar o Usuário.");
      setCarregando(false);
    }
  }

  useEffect(() => {
    setModelAnt({});
    verifyPermission();
    buscarPermissoes();

    if (modelId) {
      buscar(modelId);
    } else {
      atualizarModel("permission", []);
    }
  }, [modelId]);

  return (
    <div className="container-fluid px-4">
      <div className="mt-4">
        <h1>Usuário</h1>
      </div>

      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item">Usuários</li>
        <li className="breadcrumb-item active">Usuário</li>
      </ol>

      <form onSubmit={manipularEnvio}>
        <div className="card mb-4">
          <div className="card-header">Geral</div>

          <div className="card-body">
            <div className="row">
              <div className="col-md-4">
                <Input
                  id="input-name"
                  label="Nome"
                  required
                  placeholder="Nome"
                  value={model.name || ""}
                  disabled={carregando || !usuarioPodeEditar}
                  onChange={(e) =>
                    atualizarModel("name", e.currentTarget.value)
                  }
                />
              </div>

              <div className="col-md-4">
                <Input
                  id="input-email"
                  label="E-mail"
                  type="email"
                  required
                  placeholder="E-mail"
                  value={model.email || ""}
                  disabled={carregando || !usuarioPodeEditar}
                  onChange={(e) =>
                    atualizarModel("email", e.currentTarget.value)
                  }
                />
              </div>

              <div className="col-md-4">
                <AutocompleteGenerico
                  id="campo-situations"
                  idItem="code"
                  required
                  descricaoItem="description"
                  label="Situação"
                  endpoint="/user/situations"
                  value={model?.situation || {}}
                  disabled={carregando || !usuarioPodeEditar}
                  onChange={(situation) =>
                    atualizarModel("situation", situation ?? {})
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-header">Senha</div>
          <div className="card-body">
            <div className="row">
              {habilitarCamposSenha ? (
                <>
                  <div className="col-md-6">
                    <Input
                      id="input-password"
                      label="Senha"
                      required
                      type="password"
                      placeholder="Senha"
                      value={model.password || ""}
                      disabled={carregando || !usuarioPodeEditar}
                      onChange={(e) =>
                        atualizarModel("password", e.currentTarget.value)
                      }
                    />
                  </div>

                  <div className="col-md-6">
                    <Input
                      id="input-senhaConfirmacao"
                      label="Confirmar Senha"
                      required
                      type="password"
                      placeholder="Confirmar Senha"
                      value={senhaConfirmacao || ""}
                      disabled={carregando || !usuarioPodeEditar}
                      onChange={(e) =>
                        setsenhaConfirmacao(e.currentTarget.value)
                      }
                    />
                  </div>
                </>
              ) : (
                <button
                  className="btn btn-warning"
                  disabled={carregando || !usuarioPodeEditar}
                  onClick={() => setHabilitarCamposSenha(true)}
                >
                  Alterar Senha
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-header">Permissões</div>

          <div className="card-body">
            <div className="row">
              {hasPermission ? (
                permissoes.map((permissao) => (
                  <div
                    className="col-md-6"
                    key={`input-permissao-${permissao.code}`}
                  >
                    <SeletorBooleanoGenerico
                      id={`input-permissao-${permissao.code}`}
                      key={`input-permissao-${permissao.code}`}
                      required
                      disabled={carregando || !usuarioPodeEditar}
                      label={permissao.description}
                      value={
                        model &&
                        model.permission &&
                        !!model.permission.find(
                          (p: any) => p.code === permissao.code
                        )
                      }
                      onChange={(newValue) => {
                        if (Number(newValue) === 1) {
                          const permissaoExiste = model.permission.find(
                            (p: any) => p.code === permissao.code
                          );

                          if (!permissaoExiste) {
                            const userPermission = [
                              ...model.permission,
                              permissao,
                            ];
                            atualizarModel("permission", userPermission);
                          }
                        } else {
                          const userPermission = model.permission.filter(
                            (mPermissao: any) =>
                              mPermissao.code !== permissao.code
                          );
                          atualizarModel("permission", userPermission);
                        }
                      }}
                    />
                  </div>
                ))
              ) : (
                <h2>
                  Usuario nao possui autorizacao para alterar as permissoes
                </h2>
              )}
            </div>
          </div>
        </div>

        <div className="d-inline-block w-100">
          <div className="float-end">
            <button
              className="btn btn-secondary mb-4"
              type="button"
              disabled={carregando}
              onClick={cancelar}
            >
              Cancelar
            </button>
            &nbsp;
            <button
              className="btn btn-success mb-4"
              type="submit"
              disabled={carregando || !usuarioPodeEditar}
            >
              Salvar
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
