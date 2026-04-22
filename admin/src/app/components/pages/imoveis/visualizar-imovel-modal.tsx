import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { apiService } from "../../../services/api.service";
import {
  converterParaCep,
  converterParaMoeda,
} from "../../../utils/parser.utils";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { CDN_URL } from "../../../services/cdn.service";
import { imageFallback } from "../../../helpers/image-fallback";
import { VisualizarGaleriaDeImagens } from "./visualizar-galeria-de-imagens";

export const VisualizarImovelModal = ({ code: modelId }: { code: string }) => {
  const [carregando, setCarregando] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState('IMAGENS');
  const [model, setModel] = useState({} as any);

  async function toggle() {
    setIsOpen((value) => !value);
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
    setModel({});

    try {
      const resposta = await apiService.get(`/property/properties/${modelId}`);
      const images = await buscarImagensDoImovel(modelId);
      const photo = images && images.length ? images[0].photo : '';
      const documents = await buscarDocumentosDoImovel(modelId);

      const newModel = Object.assign({}, resposta.data);
      newModel.images = images;
      newModel.photo = photo;
      newModel.documents = documents;

      if (newModel.zipCode) {
        newModel.zipCode = converterParaCep(String(newModel.zipCode));
      }

      setModel(newModel);
      setCarregando(false);
    } catch (error) {
      console.log({ error });
      toast.error("Houve um erro ao buscar o Imovel.");
      setCarregando(false);
    }
  }

  useEffect(() => {
    if (isOpen) {
      buscar(modelId);
    }
  }, [isOpen, modelId]);

  return (
    <>
      <button type="button" className="btn btn-primary btn-sm" onClick={() => toggle()} title="Visualizar">
        <i className="fas fa-search fa-fw"></i>
        <span>Visualizar</span>
      </button>

      <Modal isOpen={isOpen} toggle={toggle} size="xl">
        <ModalHeader toggle={toggle}>Visualização de Imovel</ModalHeader>
        <ModalBody>
          {carregando ? 'Carregando...' : null}
          {!carregando && model && model.code ? (
            <>
              <div className="row p-2">
                <div className="col-md-3 mt-1">
                  <img
                    className="img-fluid img-responsive rounded product-image"
                    src={`${CDN_URL}/original-${model.photo}`}
                    alt={model.title}
                    onError={imageFallback}
                  />
                </div>

                <div className="col-md-6 mt-1">
                  <h5>{model.title}</h5>

                  <div className="mt-1 mb-1 spec-1">
                    <p className="text-justify text-truncate para mb-0">
                      <b>Código:</b>
                      &nbsp;
                      <span>{model.code}</span>
                    </p>
                    <p className="text-justify text-truncate para mb-0">
                      <b>Código Interno:</b>
                      &nbsp;
                      <span>{model.internalCode}</span>
                    </p>
                    <p className="text-justify text-truncate para mb-0">
                      <b>Categoria:</b>
                      &nbsp;
                      <span>{model?.category?.description}</span>
                    </p>
                    <p className="text-justify text-truncate para mb-0">
                      <b>Cidade:</b>
                      &nbsp;
                      <span>{model?.city?.description}</span>
                    </p>
                    <p className="text-justify text-truncate para mb-0">
                      <b>Bairro:</b>
                      &nbsp;
                      <span>{model?.neighborhood?.description}</span>
                    </p>
                    <p className="text-justify text-truncate para mb-0">
                      <b>Quartos:</b>
                      &nbsp;
                      <span>{model.bedroom || 0}</span>
                    </p>
                    <p className="text-justify text-truncate para mb-0">
                      <b>Vagas de Garagem:</b>
                      &nbsp;
                      <span>{model.parkingVacancy || 0}</span>
                    </p>
                    <p className="text-justify text-truncate para mb-0">
                      <b>Area Total:</b>
                      &nbsp;
                      <span>{model.totalArea || 0} m2</span>
                    </p>
                    <p className="text-justify text-truncate para mb-0">
                      <b>Zona:</b>
                      &nbsp;
                      <span>{model?.zone?.description}</span>
                    </p>
                  </div>
                </div>
                <div className="align-items-center align-content-center col-md-3 border-left mt-1">
                  <div className="d-flex flex-row align-items-center">
                    <h4 className="mr-1">
                      R$ {converterParaMoeda(model.price || 0, false)}
                    </h4>
                  </div>

                  <p className="text-justify text-truncate para mb-0">
                    <b>Tipo:</b>
                    &nbsp;
                    <span>{model?.transaction?.description}</span>
                  </p>

                  <p className="text-justify text-truncate para mb-0">
                    <b>Financiavel:</b>
                    &nbsp;
                    <span>{model.financeable ? "Sim" : "Não"}</span>
                  </p>

                  <div className="d-flex flex-column mt-4">
                  </div>
                </div>
              </div>

              <ul className="nav nav-pills nav-fill">
                <li className="nav-item">
                  <button className={`nav-link ${currentTab === 'IMAGENS' ? 'active' : ''}`} onClick={() => setCurrentTab('IMAGENS')}>Imagens</button>
                </li>
                <li className="nav-item">
                  <button className={`nav-link ${currentTab === 'DOCUMENTOS' ? 'active' : ''}`} onClick={() => setCurrentTab('DOCUMENTOS')}>Documentos</button>
                </li>
              </ul>

              {currentTab === 'IMAGENS' ? (
                <>
                  <VisualizarGaleriaDeImagens
                    imagens={model.images || []}
                  />

                  <div className="row p-2"></div>
                </>
              ) : null}

              {currentTab === 'DOCUMENTOS' ? (
                <div className="row p-2">
                  {model.documents.length > 0 ? model.documents.map(({ document, filename }: { [id: string]: any }, index: number) => (
                    <div className="col-md-3 mb-3 mt-3" key={index}>
                      <div className="card">
                        <div className="card-body">
                          <div className="text-center p-2">
                            <i className="fa-regular fa-file-lines fa-10x mb-2"></i>
                            <p>{filename}</p>
                          </div>
                          <a
                            className="btn btn-primary btn-sm btn-block"
                            href={`${CDN_URL}/${document}`}
                            rel="noreferrer"
                            target="_blank"
                            download={document}
                          >
                            Baixar
                          </a>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="col-md-12 p-4 text-center">
                      <p>Nenhum documento cadastrado</p>
                    </div>
                  ) }
                </div>
              ) : null}
            </>
          ) : null}
        </ModalBody>
      </Modal>
    </>
  );
};
