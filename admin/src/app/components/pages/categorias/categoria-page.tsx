import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { apiService } from "../../../services/api.service";
import { ObjectHelper } from "../../../helpers/object.helper";

export const CategoriaPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [model, setModel] = useState({} as any);
  const [modelAnt, setModelAnt] = useState({} as any);
  const [carregando, setCarregando] = useState(true);

  const modelId = params.code || null;

  function atualizarModel(chave: string, valor: any) {
    setModel((modelAnt: any) => ({ ...modelAnt, [chave]: valor }));
  }

  async function cancelar(event: any) {
    event.preventDefault();

    navigate(`/admin/categorias`);
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
    ]);

    return newModel;
  }

  async function salvarRegistro(data: any) {
    const newModel = removeCamposSalvar(data);
    let code = modelId || "";

    if (code) {
      await apiService.patch(`/property/categories/${code}`, newModel);
    } else {
      const resposta = await apiService.post(
        `/property/categories`,
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
        navigate(`/admin/categorias/${code}`);
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

  async function buscar(modelId: string) {
    setCarregando(true);
    setModel({});
    setModelAnt({});

    try {
      const dados = await apiService
        .get(`/property/categories/${modelId}`)
        .then((resposta) => resposta.data);

      const newModel = Object.assign({}, dados);

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
    if (modelId) {
      buscar(modelId);
    } else {
      setCarregando(false);
    }
  }, [modelId]);

  return (
    <div className="container-fluid px-4">
      <div className="mt-4">
        <h1>Categoria</h1>
      </div>

      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item">Categorias</li>
        <li className="breadcrumb-item active">Categoria</li>
      </ol>

      <form onSubmit={manipularEnvio}>
        <div className="card mb-4">
          <div className="card-header">Geral</div>

          <div className="card-body">
            <div className="row">
              <div className="col-md-12">
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
          </div>
        </div>
      </form>
    </div>
  );
};
