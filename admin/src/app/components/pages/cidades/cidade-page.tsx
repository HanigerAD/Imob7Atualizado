import _ from "lodash";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { apiService } from "../../../services/api.service";
import { ObjectHelper } from "../../../helpers/object.helper";
import { confirmAlert } from "react-confirm-alert";
import { Link } from "react-router-dom";
import { ErrorModalContext } from "../../shared/ErrorModal";

export const ErrorContent = ({ neighborhoods, properties }: { neighborhoods: any[], properties: any[] }) => (
  <>
    {neighborhoods && neighborhoods.length ? <h3>Bairros ({neighborhoods.length} Registros)</h3> : ''}
    {neighborhoods && neighborhoods.length ? neighborhoods.map(
      (neighborhood: any) =>
      (
        <div key={`neighborhoods-${neighborhood.code}`}>
          <Link target="_blank" to={`/admin/bairros/${neighborhood.code}`}>{neighborhood.description}</Link>
          <br />
        </div>
      )
    ) : ''}

    {properties && properties.length ? <h3>Imoveis ({properties.length} Registros)</h3> : ''}
    {properties && properties.length ? properties.map(
      (property: any) =>
      (
        <div key={`properties-${property.code}`}>
          <Link target="_blank" to={`/admin/imoveis/${property.code}`}>Código {property.code} - Código Interno {property.internalCode} - {property.title}</Link>
          <br />
        </div>
      )
    ) : ''}
  </>
);

export const CidadePage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [model, setModel] = useState({} as any);
  const [modelAnt, setModelAnt] = useState({} as any);
  const [ufs, setUfs] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const { showError } = useContext<any>(ErrorModalContext);

  const modelId = params.code || null;

  function atualizarModel(chave: string, valor: any) {
    setModel((modelAnt: any) => ({ ...modelAnt, [chave]: valor }));
  }

  async function cancelar(event: any) {
    event.preventDefault();

    navigate(`/admin/cidades`);
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
      "description",
      "uf",
    ]);

    newModel.uf = newModel.uf
      ? ObjectHelper.mantemSomenteCampos(newModel.uf, ["code"])
      : null;
    newModel.uf = newModel.uf ? newModel.uf.code : null;

    return newModel;
  }

  async function salvarRegistro(data: any) {
    const newModel = removeCamposSalvar(data);
    let code = modelId || "";

    if (code) {
      await apiService.patch(`/locality/city/${code}`, newModel);
    } else {
      const resposta = await apiService.post(`/locality/city`, newModel);

      code = resposta.data[0];
    }

    return code;
  }

  async function salvar(data: any) {
    setCarregando(true);

    try {
      let code = await salvarRegistro(data);

      toast.success("Registro salvo com sucesso");
      setCarregando(false);

      if (code != modelId) {
        navigate(`/admin/cidades/${code}`);
      } else {
        buscar(code);
      }
    } catch (error) {
      console.log({ error });
      toast.error(
        "Houve um erro ao salvar o novo Registro. Verifique se os campos foram preenchidos corretamente"
      );
      setCarregando(false);
    }
  }

  async function deletar(model: any) {
    confirmAlert({
      title: "Atenção",
      message: `Você deseja realmente deletar o registro ${model.description} ?`,
      buttons: [
        {
          label: "Sim",
          onClick: async () => {
            try {
              setCarregando(true);
              await apiService.delete(
                `/locality/city/${model.code}`
              );
              toast.success("Registro removido com sucesso");
              navigate(`/admin/cidades`);
            } catch (error: any) {
              console.log({ error });
              if (error && error?.response && error?.response?.data) {
                let message = "Algo inesperado ocorreu! Verifique se o registro selecionado não está sendo utilizado";

                if (error?.response?.data?.message) {
                  message = error?.response?.data?.message;
                }

                if (error?.response?.data?.neighborhoods || error?.response?.data?.properties) {
                  let content = <ErrorContent neighborhoods={error?.response?.data?.neighborhoods} properties={error?.response?.data?.properties} />;
                  showError(message, content);
                } else {
                  toast.error(`${message}`);
                }
              }
              setCarregando(false);
            }
          },
        },
        {
          label: "Não",
          onClick: () => { },
        },
      ],
    });
  }

  async function buscarUfs() {
    setCarregando(true);
    setUfs([]);

    try {
      const resposta = await apiService.get(`/locality/uf`);
      setUfs(resposta.data);
      setCarregando(false);
    } catch (error) {
      console.log({ error });
      toast.error("Houve um erro ao buscar os UFs.");
      setCarregando(false);
    }
  }

  async function buscar(modelId: string) {
    setCarregando(true);
    setModel({});

    try {
      const resposta = await apiService.get(`/locality/city/${modelId}`);

      const newModel = Object.assign({}, resposta.data);

      setModelAnt(newModel);
      setModel(newModel);

      setCarregando(false);
    } catch (error) {
      console.log({ error });
      toast.error("Houve um erro ao buscar o Registro.");
      setCarregando(false);
    }
  }

  useEffect(() => {
    buscarUfs();
  }, []);

  useEffect(() => {
    setModelAnt({});

    if (modelId) {
      buscar(modelId);
    }
  }, [modelId]);

  return (
    <div className="container-fluid px-4">
      <div className="mt-4">
        <h1>Cidade</h1>
      </div>

      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item">Cidades</li>
        <li className="breadcrumb-item active">Cidade</li>
      </ol>

      <form onSubmit={manipularEnvio}>
        <div className="card mb-4">
          <div className="card-header">Geral</div>

          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <div className="form-floating mb-3">
                  <select
                    className="form-control"
                    id="input-uf"
                    placeholder="UF"
                    value={model?.uf?.code || ""}
                    onChange={(event) =>
                      atualizarModel(
                        "uf",
                        ufs.find(({ code }) => code == event.target.value) ||
                        null
                      )
                    }
                  >
                    <option value={""} disabled>
                      Selecione...
                    </option>
                    {ufs.map((uf: any) => (
                      <option key={uf.code} value={uf.code}>
                        {uf.description}
                      </option>
                    ))}
                  </select>
                  <label htmlFor="input-uf">UF</label>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-floating mb-3">
                  <input
                    className="form-control"
                    id="input-description"
                    type="text"
                    placeholder="Descrição"
                    value={model.description || ""}
                    onChange={(event) =>
                      atualizarModel("description", event.target.value)
                    }
                  />
                  <label htmlFor="input-description">Descrição</label>
                </div>
              </div>
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
              disabled={carregando}
            >
              Salvar
            </button>
            &nbsp;
            <button
              className="btn btn-danger mb-4"
              type="button"
              disabled={carregando}
              onClick={() => deletar(model)}
            >
              Deletar
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
