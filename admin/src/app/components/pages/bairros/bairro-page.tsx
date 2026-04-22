import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { apiService } from "../../../services/api.service";
import { ObjectHelper } from "../../../helpers/object.helper";
import { Link } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import { ErrorModalContext } from "../../shared/ErrorModal";

export const ErrorContent = ({ properties }: { properties: any[] }) => (
  <>
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

export const BairroPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [model, setModel] = useState({} as any);
  const [modelAnt, setModelAnt] = useState({} as any);
  const [ufs, setUfs] = useState([]);
  const [cidades, setCidades] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const { showError } = useContext<any>(ErrorModalContext);

  const modelId = params.code || null;

  function atualizarModel(chave: string, valor: any) {
    setModel((modelAnt: any) => ({ ...modelAnt, [chave]: valor }));
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
                `/neighborhood/neighborhoods/${model.code}`
              );
              toast.success("Registro removido com sucesso");
              navigate(`/admin/bairros`);
            } catch (error: any) {
              console.log({ error });
              if (error && error?.response && error?.response?.data) {
                let message = "Algo inesperado ocorreu! Verifique se o registro selecionado não está sendo utilizado";

                if (error?.response?.data?.message) {
                  message = error?.response?.data?.message;
                }

                if (error?.response?.data?.properties) {
                  let content = <ErrorContent properties={error?.response?.data?.properties} />;
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

  async function cancelar(event: any) {
    event.preventDefault();

    navigate(`/admin/bairros`);
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
      "city",
    ]);

    newModel.city = newModel.city
      ? ObjectHelper.mantemSomenteCampos(newModel.city, ["code"])
      : null;
    newModel.city = newModel.city ? newModel.city.code : null;

    return newModel;
  }

  async function salvarRegistro(data: any) {
    const newModel = removeCamposSalvar(data);
    let code = modelId || "";

    if (code) {
      await apiService.patch(`/neighborhood/neighborhoods/${code}`, newModel);
    } else {
      const resposta = await apiService.post(
        `/neighborhood/neighborhoods`,
        newModel
      );

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
        navigate(`/admin/bairros/${code}`);
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

  async function buscarUfs() {
    setCarregando(true);
    const newUfs = await apiService
      .get(`/locality/uf`)
      .then((resposta) => resposta.data)
      .catch(() => []);
    setUfs(newUfs);
    setCarregando(false);
  }

  async function buscarCidades() {
    setCarregando(true);
    const newCidades = await apiService
      .get(`/locality/city`)
      .then((resposta) => resposta.data)
      .catch(() => []);
    setCidades(newCidades);
    setCarregando(false);
  }

  async function buscar(modelId: string) {
    setCarregando(true);
    setModel({});
    setModelAnt({});

    try {
      const dados = await apiService
        .get(`/neighborhood/neighborhoods/${modelId}`)
        .then((resposta) => resposta.data);

      const newModel = Object.assign({}, dados);

      if (cidades.length > 0) {
        newModel.city = cidades.find(
          (cidade: any) => cidade.code == newModel.city
        ) || { code: newModel.city };
      } else {
        const city = await apiService
          .get(`/locality/city/${newModel.city}`)
          .then((resposta) => resposta.data);
        newModel.city = city;
      }

      if (ufs.length > 0) {
        newModel.uf = ufs.find(
          (uf: any) => uf.code == newModel?.city?.uf?.code
        ) || {
          code: newModel?.city?.uf?.code,
        };
      } else {
        const uf = await apiService
          .get(`/locality/uf/${newModel?.city?.uf?.code}`)
          .then((resposta) => resposta.data);
        newModel.uf = uf;
      }

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
    buscarCidades();
  }, []);

  useEffect(() => {
    if (modelId) {
      buscar(modelId);
    }
  }, [modelId]);

  return (
    <div className="container-fluid px-4">
      <div className="mt-4">
        <h1>Bairro</h1>
      </div>

      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item">Bairros</li>
        <li className="breadcrumb-item active">Bairro</li>
      </ol>

      <form onSubmit={manipularEnvio}>
        <div className="card mb-4">
          <div className="card-header">Geral</div>

          <div className="card-body">
            <div className="row">
              <div className="col-md-4">
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

              <div className="col-md-4">
                <div className="form-floating mb-3">
                  <select
                    className="form-control"
                    id="input-city"
                    placeholder="Cidade"
                    value={model?.city?.code || ""}
                    onChange={(event) =>
                      atualizarModel(
                        "city",
                        cidades.find(
                          ({ code }) => code == event.target.value
                        ) || null
                      )
                    }
                  >
                    <option value={""} disabled>
                      Selecione...
                    </option>
                    {cidades.map((city: any) => (
                      <option key={city.code} value={city.code}>
                        {city.description}
                      </option>
                    ))}
                  </select>
                  <label htmlFor="input-city">Cidade</label>
                </div>
              </div>

              <div className="col-md-4">
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
