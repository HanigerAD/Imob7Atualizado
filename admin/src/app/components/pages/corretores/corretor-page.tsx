import _ from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TextEditor from "react-quill";
import { toast } from "react-toastify";
import ImageFallback from "../../../assets/images/image-fallback.png";
import { apiService } from "../../../services/api.service";
import { ObjectHelper } from "../../../helpers/object.helper";
import { CDN_URL } from "../../../services/cdn.service";
import AddImage from "../../../assets/images/add-image.jpg";
import { imageFallback } from "../../../helpers/image-fallback";
import Input from "../../shared/input-generico";
import { converterParaTelefone } from "../../../utils/parser.utils";
import { SeletorBooleanoGenerico } from "../../shared/seletor-booleano-generico";

export const CorretorPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [model, setModel] = useState({} as any);
  const [modelAnt, setModelAnt] = useState({} as any);
  const [users, setUsers] = useState([]);
  const [carregando, setCarregando] = useState(false);

  const modelId = params.code || null;

  function atualizarModel(chave: string, valor: any) {
    setModel((modelAnt: any) => ({ ...modelAnt, [chave]: valor }));
  }

  async function cancelar(event: any) {
    event.preventDefault();

    navigate(`/admin/corretores`);
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

    newModel = ObjectHelper.mantemSomenteCampos(newModel, ["name", "phone", "flagVisivelSite"]);

    newModel.user = newModel.user
      ? ObjectHelper.mantemSomenteCampos(newModel.user, ["code"])
      : null;
    newModel.user = newModel.user ? newModel.user.code : null;

    return newModel;
  }

  async function salvarCorretor(data: any) {
    const newModel = removeCamposSalvar(data);
    let code = modelId || "";

    if (code) {
      await apiService.patch(`/agent/${code}`, newModel);
    } else {
      const resposta = await apiService.post(`/agent`, newModel);

      code = resposta.data[0];
    }

    return code;
  }

  async function salvarImagemDaCorretor(code: string, image: any) {
    if (image && typeof image != "string") {
      const data = new FormData();

      data.append("file", image);

      await apiService.post(`/agent/${code}/image`, data);
    }
  }

  async function salvar(data: any) {
    setCarregando(true);

    try {
      let code = await salvarCorretor(data);
      await salvarImagemDaCorretor(code, data.image);

      toast.success("Registro salvo com sucesso");
      setCarregando(false);

      if (code != modelId) {
        navigate(`/admin/corretores/${code}`);
      } else {
        buscar(code);
      }
    } catch (error) {
      console.log({ error });
      toast.error(
        "Houve um erro ao salvar a Corretor. Verifique se os campos foram preenchidos corretamente"
      );
      setCarregando(false);
    }
  }

  async function buscar(modelId: string) {
    setCarregando(true);
    setModel({});

    try {
      const resposta = await apiService.get(`/agent/${modelId}`);

      const newModel = Object.assign({}, resposta.data);

      if (newModel.phone) {
        newModel.phone = converterParaTelefone(newModel.phone);
      }

      setModelAnt(newModel);
      setModel(newModel);

      setCarregando(false);
    } catch (error) {
      console.log({ error });
      toast.error("Houve um erro ao buscar a Corretor.");
      setCarregando(false);
    }
  }

  const image = useMemo(() => {
    if (model.image) {
      if (typeof model.image == "string") {
        return `${CDN_URL}/${model.image}`;
      } else {
        return URL.createObjectURL(model.image);
      }
    } else {
      return ImageFallback;
    }
  }, [model]);

  useEffect(() => {
    setModelAnt({});

    if (modelId) {
      buscar(modelId);
    }
  }, [modelId]);

  return (
    <div className="container-fluid px-4">
      <div className="mt-4">
        <h1>Corretor</h1>
      </div>

      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item">Corretores</li>
        <li className="breadcrumb-item active">Corretor</li>
      </ol>

      <form onSubmit={manipularEnvio}>
        <div className="card mb-4">
          <div className="card-header">Geral</div>

          <div className="card-body">
            <div className="row">
              <div className="col-md-4">
                <img
                  loading="lazy"
                  className="mb-1"
                  src={image}
                  width="100%"
                  alt=""
                  onError={imageFallback}
                />

                <div>
                  <input
                    type="file"
                    className="d-none"
                    id="add-file"
                    accept="image/*"
                    onChange={(event: any) =>
                      atualizarModel("image", event.target.files[0])
                    }
                  />

                  <label className="card btn mb-4" htmlFor="add-file">
                    Adicionar Imagem
                  </label>
                </div>
              </div>

              <div className="col-md-8">
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-floating mb-3">
                      <input
                        className="form-control"
                        id="input-name"
                        type="text"
                        required
                        placeholder="Nome"
                        value={model.name || ""}
                        onChange={(event) =>
                          atualizarModel("name", event.target.value)
                        }
                      />
                      <label htmlFor="input-name">Nome</label>
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="form-floating mb-3">
                      <Input
                        id="input-phone"
                        label="Telefone"
                        placeholder="(00) 0 0000-0000"
                        mask="phone"
                        value={model.phone || ""}
                        onChange={(e) =>
                          atualizarModel("phone", e.currentTarget.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="form-floating mb-3">
                      <SeletorBooleanoGenerico
                        id="input-flagVisivelSite"
                        label="Visivel no site"
                        value={model?.flagVisivelSite}
                        onChange={(value) => atualizarModel("flagVisivelSite", value)}
                      />
                    </div>
                  </div>
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
