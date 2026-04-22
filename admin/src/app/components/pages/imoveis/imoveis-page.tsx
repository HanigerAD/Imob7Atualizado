import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";
import { imageFallback } from "../../../helpers/image-fallback";
import { apiService } from "../../../services/api.service";
import { CDN_URL } from "../../../services/cdn.service";
import { Pagination } from "../../layouts/admin/components/pagination";
import { usePagination } from "../../../hooks/usePagination";
import { ImoveisFiltros } from "./imoveis-filtros";
import { converterParaMoeda } from "../../../utils/parser.utils";
import { VisualizarImovelModal } from "./visualizar-imovel-modal";
import { PERMISSIONS, useVerifyPermission } from "../../../hooks/useVerifyPermission";

export const ImoveisPage = () => {
  const [models, setModels] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const paginationProps = usePagination({ currentPage: 1, itemsPerPage: 5 });
  const { hasPermission, verifyPermission } = useVerifyPermission(PERMISSIONS.GESTAO_DE_IMOVEIS);

 // 🔹 Carrega a última página salva (somente na primeira renderização)
useEffect(() => {
  const savedPage = localStorage.getItem("currentImoveisPage");
  if (savedPage) {
    paginationProps.paginate(Number(savedPage));

  }
}, []);

// 🔹 Salva sempre que a página atual mudar
useEffect(() => {
  localStorage.setItem("currentImoveisPage", paginationProps.currentPage.toString());
}, [paginationProps.currentPage]);



  async function deletar(model: any) {
    confirmAlert({
      title: "Atenção",
      message: `Você deseja realmente deletar o imovel ${model.title} ?`,
      buttons: [
        {
          label: "Sim",
          onClick: async () => {
            try {
              setCarregando(true);
              await apiService.delete(`property/properties/${model.code}`);
              toast.success("Registro removido com sucesso");
              buscar();

            } catch (error) {
              console.log({ error });
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

  async function buscar(filters = {}) {
    setCarregando(true);
    setModels([]);

    try {
      const resposta = await apiService.get("/property/properties", {
        params: filters,
      });
      setModels(resposta.data);
      setCarregando(false);
    } catch (error) {
      console.log({ error });
      setCarregando(false);
    }
  }

  const currentItems = useMemo(
    () =>
      models.slice(
        paginationProps.indexOfFirstItem,
        paginationProps.indexOfLastItem
      ),
    [models, paginationProps.indexOfFirstItem, paginationProps.indexOfLastItem]
  );

  useEffect(() => {
    verifyPermission();
    buscar();
  }, []);

  return (
    <div className="container-fluid px-4">
      <div className="mt-4 d-flex justify-content-between align-items-center">
        <h1>Imóveis</h1>

        <Link className="btn btn-primary btn-sm" to="/admin/imoveis/cadastrar">
          Cadastrar
        </Link>
      </div>

      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item active">Imóveis</li>
      </ol>

      <ImoveisFiltros buscar={buscar} />

      <div className="card mb-4">
        <div className="card-header">Imóveis</div>

        <div className="card-body">
          {carregando ? (
            <div className="text-center">Carregando...</div>
          ) : (
            <>
              {currentItems.length > 0 ? (
                <>
                  {currentItems.map((model: any) => (
                    <div
                      key={`imoveis-${model.code}`}
                      className="row p-2 bg-white border rounded mb-2"
                    >
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
                            <span>{model.category}</span>
                          </p>
                          <p className="text-justify text-truncate para mb-0">
                            <b>Cidade:</b>
                            &nbsp;
                            <span>{model.city}</span>
                          </p>
                          <p className="text-justify text-truncate para mb-0">
                            <b>Bairro:</b>
                            &nbsp;
                            <span>{model.neighborhood}</span>
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
                            <span>{model.zone}</span>
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
                          <b>Transação:</b>
                          &nbsp;
                          <span>{model.transaction}</span>
                        </p>

                        <p className="text-justify text-truncate para mb-0">
                          <b>Financiavel:</b>
                          &nbsp;
                          <span>{model.financeable ? "Sim" : "Não"}</span>
                        </p>

                        <div className="d-flex flex-column mt-4">
                          <VisualizarImovelModal code={model.code} />
                          {
                            hasPermission ? (
                              <>
                                <Link
                                  className="btn btn-warning btn-sm mt-2"
                                  title="Editar"
                                  to={`/admin/imoveis/${model.code}`}
                                >
                                  <i className="fas fa-pen-to-square fa-fw"></i>
                                  <span>Editar</span>
                                </Link>
                                <button
                                  className="btn btn-danger btn-sm mt-2"
                                  title="Deletar"
                                  onClick={() => deletar(model)}
                                >
                                  <i className="fas fa-pen-to-square fa-fw"></i>
                                  <span>Deletar</span>
                                </button>
                              </>
                            ) : null
                          }
                        </div>
                      </div>
                    </div>
                  ))}

                  <Pagination totalItems={models.length} {...paginationProps} />
                </>
              ) : (
                <p>Nenhum registro encontrado</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
