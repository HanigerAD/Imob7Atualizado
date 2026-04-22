import _ from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ImageFallback from "../../../assets/images/image-fallback.png";
import { apiService } from "../../../services/api.service";
import { ObjectHelper } from "../../../helpers/object.helper";
import { CDN_URL } from "../../../services/cdn.service";
import { imageFallback } from "../../../helpers/image-fallback";
import TextEditor from "react-quill";
import Input from "../../shared/input-generico";
import { converterParaTelefone } from "../../../utils/parser.utils";
import { GaleriaDeBanners } from "./galeria-de-banners";
import { SobreNosGaleriaDeBanners } from "./sobre-nos-galeria-de-banners";

export const ConfiguracoesPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [model, setModel] = useState({} as any);
  const [modelAnt, setModelAnt] = useState({} as any);
  const [carregando, setCarregando] = useState(false);

  const modelId = params.code || null;

  function atualizarModel(chave: string, valor: any) {
    setModel((modelAnt: any) => ({ ...modelAnt, [chave]: valor }));
  }

  async function cancelar(event: any) {
    event.preventDefault();

    setModel(modelAnt);
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
      "title",
      "email",
      "institutionalText",
      "institutionalTextResume",
    ]);

    return newModel;
  }

  async function salvarConfiguracoesSite(data: any) {
    const newModel = removeCamposSalvar(data);

    await apiService.patch(`/configuration/site`, newModel);
  }

  async function salvarLogo(logo: any) {
    if (logo && typeof logo != "string") {
      const data = new FormData();

      data.append("file", logo);

      await apiService.patch(`/configuration/logo`, data);
    }
  }

  async function salvarBanners(images: any[]) {
    if (images && images.length > 0) {
      const deletedImages = images
        .filter((image) => !!image.remove)
        .map((image) => image.image);

      if (deletedImages.length) {
        for (let imageToDelete of deletedImages) {
          try {
            await apiService.delete(`/banner/${imageToDelete}`);
          } catch (e) {
            console.log(e);
          }
        }
      }

      const newImages = images.filter((image) => !!image.upload);

      if (newImages.length) {
        for (const image of newImages) {
          const data = new FormData();

          data.append("file", image.image);

          await apiService.post(`/banner`, data, {
            params: { order: image.order },
          });
        }
      }
    }
  }

  async function salvarSobreNosBanners(images: any[]) {
    if (images && images.length > 0) {
      const deletedImages = images
        .filter((image) => !!image.remove)
        .map((image) => image.image);

      if (deletedImages.length) {
        for (let imageToDelete of deletedImages) {
          await apiService.delete(`/sobre-nos-banner/${imageToDelete}`);
        }
      }

      const newImages = images.filter((image) => !!image.upload);

      if (newImages.length) {
        for (const image of newImages) {
          const data = new FormData();

          data.append("file", image.image);

          await apiService.post(`/sobre-nos-banner`, data, {
            params: { order: image.order },
          });
        }
      }
    }
  }

  async function salvar(data: any) {
    setCarregando(true);

    try {
      await salvarConfiguracoesSite(data);
      await salvarLogo(data.logo);
      await salvarBanners(data.banners);
      await salvarSobreNosBanners(data.sobreNosBanners);

      toast.success("Registro salvo com sucesso");
      setCarregando(false);

      buscar();
    } catch (error) {
      console.log({ error });
      toast.error(
        "Houve um erro ao salvar as Configurações do Site. Verifique se os campos foram preenchidos corretamente"
      );
      setCarregando(false);
    }
  }

  async function buscar() {
    setCarregando(true);
    setModel({});

    try {
      const resposta = await apiService.get(`/configuration/site`);
      const newModel: any = Object.assign({}, resposta.data);

      const respostaBanners = await apiService.get(`/banner`);
      newModel.banners = respostaBanners.data;

      const respostaSobreNosBanners = await apiService.get(`/sobre-nos-banner`);
      newModel.sobreNosBanners = respostaSobreNosBanners.data;

      setModelAnt(newModel);
      setModel(newModel);

      setCarregando(false);
    } catch (error) {
      console.log({ error });
      toast.error("Houve um erro ao buscar as Configurações do Site.");
      setCarregando(false);
    }
  }

  async function generateImagesWithWatermark() {
    setCarregando(true);
    try {
      await apiService.get(`/property/properties/generate-images-with-watermark`);
      setCarregando(false);
    } catch (error) {
      console.log({ error });
      toast.error("Houve um erro ao criar as imagens com marca d'agua.");
      setCarregando(false);
    }
  }

  const logo = useMemo(() => {
    if (model.logo) {
      if (typeof model.logo == "string") {
        return `${CDN_URL}/${model.logo}`;
      } else {
        return URL.createObjectURL(model.logo);
      }
    } else {
      return ImageFallback;
    }
  }, [model]);

  useEffect(() => {
    setModelAnt({});
    buscar();
  }, []);

  return (
    <div className="container-fluid px-4">
      <div className="mt-4">
        <h1>Configurações do Site</h1>
      </div>

      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item">Configurações</li>
        <li className="breadcrumb-item active">Site</li>
      </ol>

      <form onSubmit={manipularEnvio}>
        <div className="card mb-4">
          <div className="card-header">Geral</div>

          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <div className="form-floating mb-3">
                  <input
                    className="form-control"
                    id="input-title"
                    type="text"
                    required
                    placeholder="Titulo"
                    value={model.title || ""}
                    onChange={(event) =>
                      atualizarModel("title", event.target.value)
                    }
                  />
                  <label htmlFor="input-title">Titulo</label>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-floating mb-3">
                  <input
                    className="form-control"
                    id="input-email"
                    type="email"
                    required
                    placeholder="E-mail"
                    value={model.email || ""}
                    onChange={(event) =>
                      atualizarModel("email", event.target.value)
                    }
                  />
                  <label htmlFor="input-email">E-mail</label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-header">Texto Institucional</div>
          <div className="card-body">
            <TextEditor
              placeholder="Texto"
              className=" mb-3"
              theme="snow"
              value={model?.institutionalText || ""}
              onChange={(value) => atualizarModel("institutionalText", value)}
            />
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-header">Resumo do Texto Institucional</div>
          <div className="card-body">
            <TextEditor
              placeholder="Texto"
              className=" mb-3"
              theme="snow"
              value={model?.institutionalTextResume || ""}
              onChange={(value) =>
                atualizarModel("institutionalTextResume", value)
              }
            />
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-header">Logo</div>

          <div className="card-body">
            <div className="row">
              <div className="col-md-2">
                <img
                  loading="lazy"
                  className="mb-1"
                  src={logo}
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
                      atualizarModel("logo", event.target.files[0])
                    }
                  />

                  <label className="card btn mb-4" htmlFor="add-file">
                    Adicionar Imagem
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-header">Banners</div>

          <div className="card-body">
            <GaleriaDeBanners
              imagens={model.banners || []}
              onChange={(banners) => atualizarModel("banners", banners || [])}
            />
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-header">Banners - Pagina Sobre Nós</div>

          <div className="card-body">
            <SobreNosGaleriaDeBanners
              imagens={model.sobreNosBanners || []}
              onChange={(sobreNosBanners) => atualizarModel("sobreNosBanners", sobreNosBanners || [])}
            />
          </div>
        </div>

        <div className="d-inline-block w-100">
          <button className="btn btn-primary btn-sm"
            type="button"
            disabled={carregando}
            onClick={generateImagesWithWatermark}>
            Gerar imagens com marca d'agua
          </button>
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
