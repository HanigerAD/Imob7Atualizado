import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TextEditor from "react-quill";
import { toast } from "react-toastify";
import { apiService } from "../../../services/api.service";
import { ObjectHelper } from "../../../helpers/object.helper";
import { GaleriaDeImagens } from "./galeria-de-imagens";
import { GaleriaDeDocumentos } from "./galeria-de-documentos";
import { AutocompleteGenerico } from "../../shared/autocomplete/autocomplete-generico";
import { SeletorBooleanoGenerico } from "../../shared/seletor-booleano-generico";
import Input from "../../shared/input-generico";
import {
  converterMoedaParaNumero,
  converterParaCep,
  converterParaMoeda,
} from "../../../utils/parser.utils";
import { MapaComponent } from "../../shared/mapa/mapa-component";
import { PropertyTypeEnum } from "./property-type.enum";
import { ToastHelper } from "../../../helpers/toast.helper";
import {
  PERMISSIONS,
  useVerifyPermission,
} from "../../../hooks/useVerifyPermission";

type ImovelProps = {
  internalCode?: number;
  title?: string;
  type?: number;
  category?: number;
  profile?: number;
  conservationState?: number;
  zone?: number;
  agent?: number;
  show?: number;
  price?: string;
  dormitory?: number;
  unitAvailable?: number;
  bathroom?: number;
  parkingVacancy?: number;
  privativeArea?: string | number;
  totalArea?: string | number;
  pavement?: number;
  financeable?: number;
  description?: string;
  privateInfo?: string;
  reserved?: number;
  hectare?: string | number;
  constuctionYear?: number;
  featured?: number;
  superFeatured?: number;
  suite?: number;
  rented?: number;
  condominiumPrice?: string;
  showValue?: number;
  zipCode?: string;
  city?: number;
  neighborhood?: number;
  street?: string;
  number?: number;
  complement?: string;
  latitude?: string;
  longitude?: string;
  transaction?: number;
  situation?: number;
  linkYoutube?: string;
};

const MODEL_INITIAL = {
  show: 1,
  price: "0.00",
  dormitory: 0,
  unitAvailable: 1,
  bathroom: 0,
  parkingVacancy: 0,
  privativeArea: "0",
  totalArea: "0",
  pavement: 0,
  financeable: 0,
  reserved: 0,
  hectare: "0",
  featured: 0,
  superFeatured: 0,
  suite: 0,
  rented: 0,
  number: 0,
  condominiumPrice: "0.00",
  showValue: 1,
  latitude: "-30.1093317",
  longitude: "-51.3204208",
} as ImovelProps;

export const ImovelPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [model, setModel] = useState(MODEL_INITIAL as any);
  const [cities, setCities] = useState([]);
  const [federativeUnits, setFederativeUnits] = useState([]);
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const { hasPermission, verifyPermission } = useVerifyPermission(
    PERMISSIONS.GESTAO_DE_IMOVEIS
  );

  const modelId = params.code || null;

  function atualizarModel(chave: string, valor: any) {
    setModel((modelAnt: any) => {
      const newModel = { ...modelAnt, [chave]: valor };
      return newModel;
    });
  }

  async function cancelar(event: any) {
    event.preventDefault();

    navigate(`/admin/imoveis`);
  }

  function validarImagens(images: any[]): Boolean {
    return images && images.length > 0;
  }

  async function manipularEnvio(event: any) {
    event.preventDefault();

    if (!validarImagens(model.images)) {
      toast.error("Você deve informar ao menos 1 imagem");
      return;
    }

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
      "internalCode",
      "category",
      "type",
      "conservationState",
      "profile",
      "zone",
      "agent",
      "show",
      "title",
      "price",
      "dormitory",
      "unitAvailable",
      "bathroom",
      "parkingVacancy",
      "privativeArea",
      "totalArea",
      "pavement",
      "financeable",
      "description",
      "privateInfo",
      "reserved",
      "hectare",
      "constuctionYear",
      "featured",
      "superFeatured",
      "suite",
      "rented",
      "condominiumPrice",
      "showValue",
      "zipCode",
      "neighborhood",
      "street",
      "number",
      "complement",
      "latitude",
      "longitude",
      "transaction",
      "situation",
      "linkYoutube",
    ]);

    [
      "internalCode",
      "dormitory",
      "unitAvailable",
      "bathroom",
      "parkingVacancy",
      "pavement",
      "number",
      "financeable",
      "constuctionYear",
      "suite",
    ].forEach((key) => {
      if (!!newModel[key]) {
        newModel[key] = Number(newModel[key]);
      }
    });

    newModel.neighborhood = newModel.neighborhood
      ? ObjectHelper.mantemSomenteCampos(newModel.neighborhood, ["code"])
      : null;
    newModel.neighborhood = newModel.neighborhood
      ? newModel.neighborhood.code
      : null;

    newModel.category = newModel.category
      ? ObjectHelper.mantemSomenteCampos(newModel.category, ["code"])
      : null;
    newModel.category = newModel.category ? newModel.category.code : null;

    newModel.type = newModel.type
      ? ObjectHelper.mantemSomenteCampos(newModel.type, ["code"])
      : null;
    newModel.type = newModel.type ? newModel.type.code : null;

    newModel.conservationState = newModel.conservationState
      ? ObjectHelper.mantemSomenteCampos(newModel.conservationState, ["code"])
      : null;
    newModel.conservationState = newModel.conservationState
      ? newModel.conservationState.code
      : null;

    newModel.profile = newModel.profile
      ? ObjectHelper.mantemSomenteCampos(newModel.profile, ["code"])
      : null;
    newModel.profile = newModel.profile ? newModel.profile.code : null;

    newModel.zone = newModel.zone
      ? ObjectHelper.mantemSomenteCampos(newModel.zone, ["code"])
      : null;
    newModel.zone = newModel.zone ? newModel.zone.code : null;

    newModel.agent = newModel.agent
      ? ObjectHelper.mantemSomenteCampos(newModel.agent, ["code"])
      : null;
    newModel.agent = newModel.agent ? newModel.agent.code : null;

    newModel.situation = newModel.situation
      ? ObjectHelper.mantemSomenteCampos(newModel.situation, ["code"])
      : null;
    newModel.situation = newModel.situation ? newModel.situation.code : null;

    newModel.transaction = newModel.transaction
      ? ObjectHelper.mantemSomenteCampos(newModel.transaction, ["code"])
      : null;
    newModel.transaction = newModel.transaction
      ? newModel.transaction.code
      : null;

    newModel.federativeUnit = newModel.federativeUnit
      ? ObjectHelper.mantemSomenteCampos(newModel.federativeUnit, ["code"])
      : null;
    newModel.federativeUnit = newModel.federativeUnit
      ? newModel.federativeUnit.code
      : null;

    return newModel;
  }

  async function salvarImovel(data: any) {
    const newModel = removeCamposSalvar(data);
    newModel.price = converterMoedaParaNumero(newModel.price);

    let code = modelId || "";

    if (code) {
      await apiService.patch(`/property/properties/${code}`, newModel);
    } else {
      const resposta = await apiService.post(`/property/properties`, newModel);

      code = resposta.data[0];
    }

    return code;
  }

  async function salvarImagensDoImovel(code: string, images: any[]) {
    if (code && images && images.length > 0) {
      const deletedImages = images
        .filter((image) => !!image.remove)
        .map((image) => image.photo);

      if (deletedImages.length) {
        await apiService.patch(
          `/property/properties/${code}/delete-images`,
          deletedImages
        );
      }

      const newImages = images.filter((image) => !!image.upload);

      if (newImages.length) {
        for (const image of newImages) {
          const data = new FormData();

          data.append("file", image.photo);

          await apiService.post(`/property/properties/${code}/image`, data, {
            params: { order: image.order },
          });
        }
      }

      const updatedOrderImages = images.filter(
        (image) => !image.remove && !image.upload
      );

      if (updatedOrderImages.length) {
        const data = updatedOrderImages.map((image) => ({
          path: image.photo,
          index: image.order,
        }));

        await apiService.put(`/property/properties/images-sort`, data);
      }
    }
  }

  async function salvarDocumentosDoImovel(code: string, documents: any[]) {
    if (code && documents && documents.length > 0) {
      const deletedDocuments = documents
        .filter((document) => !!document.remove)
        .map((document) => document.document);

      if (deletedDocuments.length) {
        await apiService.patch(
          `/property/properties/${code}/delete-documents`,
          deletedDocuments
        );
      }

      const newDocuments = documents.filter((document) => !!document.upload);

      if (newDocuments.length) {
        for (const document of newDocuments) {
          const data = new FormData();

          data.append("file", document.document);

          await apiService.post(`/property/properties/${code}/document`, data);
        }
      }
    }
  }

  async function salvar(data: any) {
    setCarregando(true);
    const toastHelper = new ToastHelper();
    toastHelper.loading("Processando...");

    try {
      let code = await salvarImovel(data);
      await salvarImagensDoImovel(code, data.images);
      await salvarDocumentosDoImovel(code, data.documents);

      toastHelper.success("Registro salvo com sucesso");
      setCarregando(false);

      navigate(`/admin/imoveis`);
    } catch (error: any) {
      let errorMessage =
        error?.response?.data?.message ||
        "Houve um erro ao salvar o Imovel. Verifique se os campos foram preenchidos corretamente";
      toastHelper.error(errorMessage);

      if (error?.response?.data?.errors) {
        for (let errorItem of error?.response?.data?.errors) {
          toastHelper.error(errorItem.message);
        }
      }

      setCarregando(false);
    }
  }

  async function buscarCidades() {
    setCarregando(true);
    setCities([]);

    try {
      const resposta = await apiService.get(`/locality/city`);
      setCities(resposta.data);
      setCarregando(false);
    } catch (error) {
      console.log({ error });
      toast.error("Houve um erro ao buscar as Cidades.");
      setCarregando(false);
    }
  }

  async function buscarUfs() {
    setCarregando(true);
    setFederativeUnits([]);

    try {
      const resposta = await apiService.get(`/locality/uf`);
      setFederativeUnits(resposta.data);
      setCarregando(false);
    } catch (error) {
      console.log({ error });
      toast.error("Houve um erro ao buscar os UFs.");
      setCarregando(false);
    }
  }

  async function buscarBairros(code: string) {
    setCarregando(true);
    setNeighborhoods([]);

    try {
      const resposta = await apiService.get(
        `/locality/city/${code}/neighborhoods`
      );
      const newNeighborhoods = resposta.data;
      if (model && model.neighborhood) {
        const existe = newNeighborhoods.find(
          ({ code }: any) => code == model.neighborhood.code
        );

        if (!existe) {
          atualizarModel("neighborhood", "");
        }
      }
      setNeighborhoods(newNeighborhoods);
      setCarregando(false);
    } catch (error) {
      console.log({ error });
      toast.error("Houve um erro ao buscar os Bairros.");
      setCarregando(false);
    }
  }

  async function buscarImagensDoImovel(imovelId: string) {
    const respostaImagens = await apiService.get(
      `/property/properties/${imovelId}/images/urls`
    );

    return respostaImagens.data.map((imagem: any, index: number) => ({
      photo: imagem,
      order: index + 1,
    }));
  }

  async function buscarDocumentosDoImovel(imovelId: string) {
    const respostaDocumentos = await apiService.get(
      `/property/properties/${imovelId}/documents`
    );

    return respostaDocumentos.data;
  }

  async function buscar(modelId: string) {
    setCarregando(true);
    setModel(MODEL_INITIAL);

    try {
      const resposta = await apiService.get(`/property/properties/${modelId}`);
      const images = await buscarImagensDoImovel(modelId);
      const documents = await buscarDocumentosDoImovel(modelId);

      const newModel = Object.assign({}, resposta.data);
      newModel.images = images;
      newModel.documents = documents;

      if (newModel.price) {
        newModel.price = converterParaMoeda(String(newModel.price));
      }

      if (newModel.hectare) {
        newModel.hectare = String(newModel.hectare);
      }

      if (newModel.condominiumPrice) {
        newModel.condominiumPrice = converterParaMoeda(
          String(newModel.condominiumPrice)
        );
      }

      if (newModel.zipCode) {
        newModel.zipCode = converterParaCep(String(newModel.zipCode));
      }

      if (!newModel.latitude || !newModel.longitude) {
        newModel.latitude = "-30.1093317";
        newModel.longitude = "-51.3204208";
      } else {
        newModel.latitude = String(Number(newModel.latitude).toFixed(7));
        newModel.longitude = String(Number(newModel.longitude).toFixed(7));
      }

      newModel.show = newModel.show || MODEL_INITIAL.show;
      newModel.price = newModel.price || MODEL_INITIAL.price;
      newModel.dormitory = newModel.dormitory || MODEL_INITIAL.dormitory;
      newModel.unitAvailable =
        newModel.unitAvailable || MODEL_INITIAL.unitAvailable;
      newModel.bathroom = newModel.bathroom || MODEL_INITIAL.bathroom;
      newModel.parkingVacancy =
        newModel.parkingVacancy || MODEL_INITIAL.parkingVacancy;
      newModel.privativeArea =
        newModel.privativeArea || MODEL_INITIAL.privativeArea;
      newModel.totalArea = newModel.totalArea || MODEL_INITIAL.totalArea;
      newModel.pavement = newModel.pavement || MODEL_INITIAL.pavement;
      newModel.financeable = newModel.financeable || MODEL_INITIAL.financeable;
      newModel.reserved = newModel.reserved || MODEL_INITIAL.reserved;
      newModel.hectare = newModel.hectare || MODEL_INITIAL.hectare;
      newModel.featured = newModel.featured || MODEL_INITIAL.featured;
      newModel.superFeatured =
        newModel.superFeatured || MODEL_INITIAL.superFeatured;
      newModel.suite = newModel.suite || MODEL_INITIAL.suite;
      newModel.rented = newModel.rented || MODEL_INITIAL.rented;
      newModel.condominiumPrice =
        newModel.condominiumPrice || MODEL_INITIAL.condominiumPrice;
      newModel.showValue = newModel.showValue || MODEL_INITIAL.showValue;
      newModel.latitude = newModel.latitude || MODEL_INITIAL.latitude;
      newModel.longitude = newModel.longitude || MODEL_INITIAL.longitude;

      setModel(newModel);

      setCarregando(false);
    } catch (error) {
      console.log({ error });
      toast.error("Houve um erro ao buscar o Imovel.");
      setCarregando(false);
    }
  }

  const ehEmpreendimento = useMemo(() => {
    return model?.type && model?.type?.code == PropertyTypeEnum.EMPREENDIMENTO;
  }, [model.type]);

  useEffect(() => {
    if (model.city && model.city.code) {
      buscarBairros(model.city.code);
    }
  }, [model.city]);

  useEffect(() => {
    if (ehEmpreendimento) {
      const novoValor = {
        privativeArea: MODEL_INITIAL.privativeArea,
        totalArea: MODEL_INITIAL.totalArea,
        price: MODEL_INITIAL.price,
        condominiumPrice: MODEL_INITIAL.condominiumPrice,
        number: MODEL_INITIAL.number,
      };

      setModel((modelAnt: any) => {
        return { ...modelAnt, ...novoValor };
      });
    }
  }, [ehEmpreendimento]);

  useEffect(() => {
    if (hasPermission === false) {
      toast.error(
        `Usuario não possui a permissão ${PERMISSIONS.GESTAO_DE_IMOVEIS}`
      );
      navigate("/admin");
    }
  }, [hasPermission]);

  useEffect(() => {
    buscarCidades();
    buscarUfs();
    verifyPermission();
  }, []);

  useEffect(() => {
    if (modelId) {
      buscar(modelId);
    }
  }, [modelId]);

  return (
    <div className="container-fluid px-4">
      <div className="mt-4">
        <h1>Imóvel</h1>
      </div>

      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item">Imóveis</li>
        <li className="breadcrumb-item active">Imóvel</li>
      </ol>

      <form onSubmit={manipularEnvio}>
        <div className="card mb-4">
          <div className="card-header">Geral</div>

          <div className="card-body">
            <div className="row">
              <div className="col-md-8">
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

              <div className="col-md-4">
                <AutocompleteGenerico
                  id="campo-types"
                  idItem="code"
                  required
                  descricaoItem="description"
                  label="Tipo"
                  endpoint="/property/types"
                  value={model?.type || {}}
                  onChange={(type) => atualizarModel("type", type ?? {})}
                />
              </div>

              <div className="col-md-4">
                <AutocompleteGenerico
                  id="campo-categorias"
                  idItem="code"
                  descricaoItem="description"
                  label="Categoria"
                  required
                  endpoint="/property/categories"
                  value={model?.category || {}}
                  onChange={(category) =>
                    atualizarModel("category", category ?? {})
                  }
                />
              </div>

              <div className="col-md-4">
                <AutocompleteGenerico
                  id="campo-profile"
                  idItem="code"
                  descricaoItem="description"
                  label="Perfil"
                  required
                  endpoint="/property/profiles"
                  value={model?.profile || {}}
                  onChange={(profile) =>
                    atualizarModel("profile", profile ?? {})
                  }
                />
              </div>

              <div className="col-md-4">
                <AutocompleteGenerico
                  id="campo-zone"
                  idItem="code"
                  descricaoItem="description"
                  label="Zona"
                  required
                  endpoint="/property/zones"
                  value={model?.zone || {}}
                  onChange={(zone) => atualizarModel("zone", zone ?? {})}
                />
              </div>

              <div className="col-md-4">
                <AutocompleteGenerico
                  id="campo-situation"
                  idItem="code"
                  descricaoItem="description"
                  label="Situação"
                  required
                  endpoint="/property/situations"
                  value={model?.situation || {}}
                  onChange={(situation) =>
                    atualizarModel("situation", situation ?? {})
                  }
                />
              </div>

              <div className="col-md-4">
                <AutocompleteGenerico
                  id="campo-transaction"
                  idItem="code"
                  descricaoItem="description"
                  label="Transação"
                  required
                  endpoint="/property/transactions"
                  value={model?.transaction || {}}
                  onChange={(transaction) =>
                    atualizarModel("transaction", transaction ?? {})
                  }
                />
              </div>

              <div className="col-md-4">
                <AutocompleteGenerico
                  id="campo-conservationState"
                  idItem="code"
                  descricaoItem="description"
                  label="Estado de Conservação"
                  required
                  endpoint="/property/conservation-states"
                  value={model?.conservationState || {}}
                  onChange={(conservationState) =>
                    atualizarModel("conservationState", conservationState ?? {})
                  }
                />
              </div>
            </div>

            <TextEditor
              placeholder="Descrição"
              className=" mb-3"
              theme="snow"
              value={model?.description || ""}
              onChange={(value) => atualizarModel("description", value)}
            />
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-header">Apresentação</div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-12">
                <div className="form-floating mb-3">
                  <input
                    className="form-control"
                    id="input-linkYoutube"
                    type="text"
                    placeholder="Link Youtube"
                    value={model.linkYoutube || ""}
                    onChange={(event) =>
                      atualizarModel("linkYoutube", event.target.value)
                    }
                  />
                  <label htmlFor="input-linkYoutube">Link Youtube</label>
                </div>
              </div>
            </div>

            <GaleriaDeImagens
              imagens={model.images || []}
              onChange={(images) => atualizarModel("images", images || [])}
            />
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-header">Documentos</div>
          <div className="card-body">
            <GaleriaDeDocumentos
              documentos={model.documents || []}
              onChange={(documents) =>
                atualizarModel("documents", documents || [])
              }
            />
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-header">Endereço</div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-3">
                <div className="form-floating mb-3">
                  <select
                    className="form-control"
                    id="input-federativeUnit"
                    placeholder="UF"
                    value={model?.federativeUnit?.code || ""}
                    onChange={(event) =>
                      atualizarModel(
                        "federativeUnit",
                        federativeUnits.find(
                          ({ code }) => code == event.target.value
                        ) || null
                      )
                    }
                  >
                    <option value={""} disabled>
                      Selecione...
                    </option>
                    {federativeUnits.map((federativeUnit: any) => (
                      <option
                        key={federativeUnit.code}
                        value={federativeUnit.code}
                      >
                        {federativeUnit.description}
                      </option>
                    ))}
                  </select>
                  <label htmlFor="input-federativeUnit">UF</label>
                </div>
              </div>

              <div className="col-md-3">
                <div className="form-floating mb-3">
                  <select
                    className="form-control"
                    id="input-city"
                    placeholder="Cidade"
                    required
                    value={model?.city?.code || ""}
                    onChange={(event) =>
                      atualizarModel(
                        "city",
                        cities.find(({ code }) => code == event.target.value) ||
                          null
                      )
                    }
                  >
                    <option value={""} disabled>
                      Selecione...
                    </option>
                    {cities.map((city: any) => (
                      <option key={city.code} value={city.code}>
                        {city.description}
                      </option>
                    ))}
                  </select>
                  <label htmlFor="input-city">Cidade</label>
                </div>
              </div>

              <div className="col-md-3">
                <div className="form-floating mb-3">
                  <select
                    className="form-control"
                    id="input-neighborhood"
                    placeholder="Bairro"
                    required
                    value={model?.neighborhood?.code || ""}
                    onChange={(event) =>
                      atualizarModel(
                        "neighborhood",
                        neighborhoods.find(
                          ({ code }) => code == event.target.value
                        ) || null
                      )
                    }
                  >
                    <option value={""} disabled>
                      Selecione...
                    </option>
                    {neighborhoods.map((neighborhood: any) => (
                      <option key={neighborhood.code} value={neighborhood.code}>
                        {neighborhood.description}
                      </option>
                    ))}
                  </select>
                  <label htmlFor="input-neighborhood">Bairro</label>
                </div>
              </div>

              <div className="col-md-3">
                <Input
                  id="input-zipCode"
                  label="CEP"
                  placeholder="00000-000"
                  mask="cep"
                  value={model.zipCode || ""}
                  onChange={(e) =>
                    atualizarModel("zipCode", e.currentTarget.value)
                  }
                />
              </div>

              <div className="col-md-6">
                <div className="form-floating mb-3">
                  <input
                    className="form-control"
                    id="input-street"
                    type="text"
                    placeholder="Logradouro"
                    required
                    value={model.street || ""}
                    onChange={(event) =>
                      atualizarModel("street", event.target.value)
                    }
                  />
                  <label htmlFor="input-street">Logradouro</label>
                </div>
              </div>

              <div className="col-md-3">
                <div className="form-floating mb-3">
                  <input
                    className="form-control"
                    id="input-number"
                    type="number"
                    placeholder="Número"
                    value={model.number || ""}
                    onChange={(event) =>
                      atualizarModel("number", event.target.value)
                    }
                  />
                  <label htmlFor="input-number">Número</label>
                </div>
              </div>

              <div className="col-md-3">
                <div className="form-floating mb-3">
                  <input
                    className="form-control"
                    id="input-complement"
                    type="text"
                    placeholder="Complemento"
                    value={model.complement || ""}
                    onChange={(event) =>
                      atualizarModel("complement", event.target.value)
                    }
                  />
                  <label htmlFor="input-complement">Complemento</label>
                </div>
              </div>

              <div className="col-md-12">
                <div className="row">
                  <div className="col-md-8">
                    {model && model.latitude && model.longitude ? (
                      <MapaComponent
                        style={{ width: "100%", height: "500px" }}
                        latLngLiteral={{
                          lat: Number(model.latitude),
                          lng: Number(model.longitude),
                        }}
                        onChangeAddress={(value) =>
                          atualizarModel("enderecoAproximado", value)
                        }
                        onChangeLatLng={({ lat, lng }) => {
                          setModel((value: any) => ({
                            ...value,
                            latitude: String(lat.toFixed(7)),
                            longitude: String(lng.toFixed(7)),
                          }));
                        }}
                      />
                    ) : null}
                  </div>
                  <div className="col-md-4">
                    <div className="form-floating mb-3">
                      <input
                        className="form-control"
                        id="input-enderecoAproximado"
                        type="text"
                        placeholder="Endereço Aproximado"
                        value={model.enderecoAproximado || ""}
                        disabled
                      />
                      <label htmlFor="input-enderecoAproximado">
                        Endereço Aproximado
                      </label>
                    </div>

                    <div className="form-floating mb-3">
                      <input
                        className="form-control"
                        id="input-latitude"
                        type="text"
                        placeholder="Latitude"
                        value={model.latitude || ""}
                        disabled
                      />
                      <label htmlFor="input-latitude">Latitude</label>
                    </div>

                    <div className="form-floating mb-3">
                      <input
                        className="form-control"
                        id="input-longitude"
                        type="text"
                        placeholder="Longitude"
                        value={model.longitude || ""}
                        disabled
                      />
                      <label htmlFor="input-longitude">Longitude</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-header">Caracteristicas</div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-4">
                <div className="form-floating mb-3">
                  <input
                    className="form-control"
                    id="input-bathroom"
                    type="number"
                    placeholder="Banheiros"
                    value={model.bathroom || ""}
                    onChange={(event) =>
                      atualizarModel("bathroom", event.target.value)
                    }
                  />
                  <label htmlFor="input-bathroom">Banheiros</label>
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-floating mb-3">
                  <input
                    className="form-control"
                    id="input-dormitory"
                    type="number"
                    placeholder="Dormitórios"
                    value={model.dormitory || ""}
                    onChange={(event) =>
                      atualizarModel("dormitory", event.target.value)
                    }
                  />
                  <label htmlFor="input-dormitory">Dormitórios</label>
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-floating mb-3">
                  <input
                    className="form-control"
                    id="input-parkingVacancy"
                    type="number"
                    placeholder="Vagas de Garagem"
                    value={model.parkingVacancy || ""}
                    onChange={(event) =>
                      atualizarModel("parkingVacancy", event.target.value)
                    }
                  />
                  <label htmlFor="input-parkingVacancy">Vagas de Garagem</label>
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-floating mb-3">
                  <input
                    className="form-control"
                    id="input-suite"
                    type="number"
                    placeholder="Suítes"
                    value={model.suite || ""}
                    onChange={(event) =>
                      atualizarModel("suite", event.target.value)
                    }
                  />
                  <label htmlFor="input-suite">Suítes</label>
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-floating mb-3">
                  <input
                    className="form-control"
                    id="input-privativeArea"
                    type="text"
                    placeholder="Área Privada"
                    value={model.privativeArea || ""}
                    onChange={(event) =>
                      atualizarModel("privativeArea", event.target.value)
                    }
                  />
                  <label htmlFor="input-privativeArea">Área Privada</label>
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-floating mb-3">
                  <input
                    className="form-control"
                    id="input-totalArea"
                    type="text"
                    placeholder="Área Total"
                    value={model.totalArea || ""}
                    onChange={(event) =>
                      atualizarModel("totalArea", event.target.value)
                    }
                  />
                  <label htmlFor="input-totalArea">Área Total</label>
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-floating mb-3">
                  <input
                    className="form-control"
                    id="input-hectare"
                    type="text"
                    placeholder="Hectares"
                    value={model.hectare || ""}
                    onChange={(event) =>
                      atualizarModel("hectare", event.target.value)
                    }
                  />
                  <label htmlFor="input-hectare">Hectares</label>
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-floating mb-3">
                  <input
                    className="form-control"
                    id="input-constuctionYear"
                    type="number"
                    placeholder="Ano de Construção"
                    value={model.constuctionYear || ""}
                    onChange={(event) =>
                      atualizarModel("constuctionYear", event.target.value)
                    }
                  />
                  <label htmlFor="input-constuctionYear">
                    Ano de Construção
                  </label>
                </div>
              </div>

              <div className="col-md-4">
                <SeletorBooleanoGenerico
                  id="input-pavement"
                  label="Rua Pavimentada"
                  value={model?.pavement}
                  onChange={(value) => atualizarModel("pavement", value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-header">Financeiro</div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-4">
                <Input
                  id="input-price"
                  label="Valor"
                  placeholder="0,00"
                  mask="currency"
                  prefix="R$"
                  value={model?.price}
                  onChange={(e) =>
                    atualizarModel("price", e.currentTarget.value)
                  }
                />
              </div>

              <div className="col-md-4">
                <Input
                  id="input-condominiumPrice"
                  label="Valor do Condomínio"
                  placeholder="0,00"
                  mask="currency"
                  prefix="R$"
                  value={model?.condominiumPrice}
                  onChange={(e) =>
                    atualizarModel("condominiumPrice", e.currentTarget.value)
                  }
                />
              </div>

              <div className="col-md-4">
                <SeletorBooleanoGenerico
                  id="input-financeable"
                  label="Financiável"
                  value={model?.financeable}
                  onChange={(value) => atualizarModel("financeable", value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-header">Site</div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-4">
                <SeletorBooleanoGenerico
                  id="input-show"
                  label="Exibir"
                  value={model?.show}
                  onChange={(value) => atualizarModel("show", value)}
                />
              </div>
              <div className="col-md-4">
                <SeletorBooleanoGenerico
                  id="input-showValue"
                  label="Exibir Valor"
                  value={model?.showValue}
                  onChange={(value) => atualizarModel("showValue", value)}
                />
              </div>

              <div className="col-md-4">
                <SeletorBooleanoGenerico
                  id="input-featured"
                  label="Destaque"
                  value={model?.featured}
                  onChange={(value) => atualizarModel("featured", value)}
                />
              </div>

              <div className="col-md-4">
                <SeletorBooleanoGenerico
                  id="input-superFeatured"
                  label="Super Destaque"
                  value={model?.superFeatured}
                  onChange={(value) => atualizarModel("superFeatured", value)}
                />
              </div>

              <div className="col-md-4">
                <SeletorBooleanoGenerico
                  id="input-rented"
                  label="Alugado"
                  value={model?.rented}
                  onChange={(value) => atualizarModel("rented", value)}
                />
              </div>

              <div className="col-md-4">
                <SeletorBooleanoGenerico
                  id="input-reserved"
                  label="Reservado"
                  value={model?.reserved}
                  onChange={(value) => atualizarModel("reserved", value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-header">Gestão</div>
          <div className="card-body">
            <div className="row">
              {model.code ? (
                <div className="col-md-4">
                  <div className="form-floating mb-3">
                    <input
                      className="form-control"
                      id="input-code"
                      type="text"
                      placeholder="Código"
                      value={model.code || ""}
                      disabled
                    />
                    <label htmlFor="input-code">Código</label>
                  </div>
                </div>
              ) : null}
              <div className={`col-md-${model.code ? "4" : "8"}`}>
                <div className="form-floating mb-3">
                  <input
                    className="form-control"
                    id="input-internalCode"
                    type="text"
                    placeholder="Código Interno"
                    required
                    value={model.internalCode || ""}
                    onChange={(event) =>
                      atualizarModel("internalCode", event.target.value)
                    }
                  />
                  <label htmlFor="input-internalCode">Código Interno</label>
                </div>
              </div>
              <div className="col-md-4">
                <AutocompleteGenerico
                  id="campo-agent"
                  idItem="code"
                  descricaoItem="name"
                  label="Corretor"
                  endpoint="/agent"
                  value={model?.agent || {}}
                  onChange={(agent) => atualizarModel("agent", agent ?? {})}
                />
              </div>
              <div className="col-md-4">
                <SeletorBooleanoGenerico
                  id="input-unitAvailable"
                  label="Unidade Disponível"
                  value={model?.unitAvailable}
                  onChange={(value) => atualizarModel("unitAvailable", value)}
                />
              </div>
              <div className="col-md-8">
                <div className="form-floating mb-3">
                  <input
                    className="form-control"
                    id="input-privateInfo"
                    type="text"
                    placeholder="Informações Privadas"
                    value={model.privateInfo || ""}
                    onChange={(event) =>
                      atualizarModel("privateInfo", event.target.value)
                    }
                  />
                  <label htmlFor="input-privateInfo">
                    Informações Privadas
                  </label>
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
