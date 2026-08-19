import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { apiService } from "../../../services/api.service";
import { CDN_URL } from "../../../services/cdn.service";
import { imageFallback } from "../../../helpers/image-fallback";
import {
  PERMISSIONS,
  useVerifyPermission,
} from "../../../hooks/useVerifyPermission";

type ImovelDestaque = {
  code: number;
  internalCode: number;
  title: string;
  photo?: string | null;
};

type GrupoDestaque = "venda" | "locacao" | "empreendimentos";

export const DestaquesHomePage = () => {
  const [venda, setVenda] = useState<ImovelDestaque[]>([]);
  const [locacao, setLocacao] = useState<ImovelDestaque[]>([]);
  const [empreendimentos, setEmpreendimentos] = useState<ImovelDestaque[]>([]);

  const [carregando, setCarregando] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const [arrastando, setArrastando] = useState<{
    grupo: GrupoDestaque;
    index: number;
  } | null>(null);

  const { verifyPermission } = useVerifyPermission(
    PERMISSIONS.GESTAO_DE_IMOVEIS
  );

  async function buscar() {
    setCarregando(true);

    try {
      const [respostaVenda, respostaLocacao, respostaEmpreendimentos] =
        await Promise.all([
          apiService.get("/property/properties", {
            params: {
              featured: true,
              finality: 1,
              excludeType: 4,
              showSite: 1,
              page: 1,
              perPage: 100,
            },
          }),

          apiService.get("/property/properties", {
            params: {
              featured: true,
              finality: 2,
              excludeType: 4,
              showSite: 1,
              page: 1,
              perPage: 100,
            },
          }),

          apiService.get("/property/properties", {
            params: {
              featured: true,
              type: 4,
              showSite: 1,
              page: 1,
              perPage: 100,
            },
          }),
        ]);

      setVenda(respostaVenda.data || []);
      setLocacao(respostaLocacao.data || []);
      setEmpreendimentos(respostaEmpreendimentos.data || []);
    } catch (error) {
      console.log({ error });
      toast.error("Houve um erro ao buscar os destaques.");
    } finally {
      setCarregando(false);
    }
  }

  function atualizarGrupo(
    grupo: GrupoDestaque,
    novaLista: ImovelDestaque[]
  ) {
    if (grupo === "venda") {
      setVenda(novaLista);
      return;
    }

    if (grupo === "locacao") {
      setLocacao(novaLista);
      return;
    }

    setEmpreendimentos(novaLista);
  }

  function obterGrupo(grupo: GrupoDestaque): ImovelDestaque[] {
    if (grupo === "venda") {
      return venda;
    }

    if (grupo === "locacao") {
      return locacao;
    }

    return empreendimentos;
  }

  function moverItem(
    grupo: GrupoDestaque,
    indexOrigem: number,
    indexDestino: number
  ) {
    if (indexOrigem === indexDestino) {
      return;
    }

    const novaLista = [...obterGrupo(grupo)];

    const [itemMovido] = novaLista.splice(indexOrigem, 1);

    novaLista.splice(indexDestino, 0, itemMovido);

    atualizarGrupo(grupo, novaLista);
  }

  async function salvarOrdem() {
    setSalvando(true);

    try {
      const dados = [
        ...venda.map((item, index) => ({
          code: item.code,
          index: index + 1,
        })),

        ...locacao.map((item, index) => ({
          code: item.code,
          index: index + 1,
        })),

        ...empreendimentos.map((item, index) => ({
          code: item.code,
          index: index + 1,
        })),
      ];

      await apiService.put("/property/properties/featured-sort", dados);

      toast.success("Ordem dos destaques salva com sucesso.");
    } catch (error) {
      console.log({ error });
      toast.error("Houve um erro ao salvar a ordem dos destaques.");
    } finally {
      setSalvando(false);
    }
  }

  function renderizarGrupo(
    titulo: string,
    grupo: GrupoDestaque,
    itens: ImovelDestaque[]
  ) {
    return (
      <div className="card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <strong>{titulo}</strong>

          <span className="text-muted">
            {itens.length} destaque{itens.length === 1 ? "" : "s"}
          </span>
        </div>

        <div className="card-body">
          <p className="text-muted">
            Arraste os imóveis para definir a ordem. Os 6 primeiros serão
            exibidos na página inicial.
          </p>

          {itens.length === 0 ? (
            <div className="alert alert-light border mb-0">
              Nenhum imóvel disponível nesta seção.
            </div>
          ) : (
            itens.map((item, index) => (
              <div
                key={`${grupo}-${item.code}`}
                draggable
                onDragStart={() =>
                  setArrastando({
                    grupo,
                    index,
                  })
                }
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => {
                  if (!arrastando) {
                    return;
                  }

                  if (arrastando.grupo !== grupo) {
                    return;
                  }

                  moverItem(grupo, arrastando.index, index);
                  setArrastando(null);
                }}
                onDragEnd={() => setArrastando(null)}
                className="border rounded bg-white p-2 mb-2 d-flex align-items-center"
                style={{
                  cursor: "grab",
                }}
              >
                <div
                  className="me-3 text-secondary"
                  style={{
                    fontSize: "24px",
                    width: "30px",
                    textAlign: "center",
                  }}
                  title="Arraste para alterar a ordem"
                >
                  ☰
                </div>

                <div
                  className="me-3 fw-bold text-center"
                  style={{
                    width: "35px",
                  }}
                >
                  {index + 1}
                </div>

                <div
                  className="me-3"
                  style={{
                    width: "90px",
                  }}
                >
                  <img
                    src={`${CDN_URL}/original-${item.photo}`}
                    alt={item.title}
                    onError={imageFallback}
                    className="img-fluid rounded"
                  />
                </div>

                <div className="flex-grow-1">
                  <div className="fw-bold">{item.title}</div>

                  <small className="text-muted">
                    Código interno: {item.internalCode}
                  </small>
                </div>

                {index < 6 ? (
                  <span className="badge bg-success ms-3">
                    Exibido na Home
                  </span>
                ) : (
                  <span className="badge bg-secondary ms-3">
                    Fora dos 6 primeiros
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  useEffect(() => {
    verifyPermission();
    buscar();
  }, []);

  return (
    <div className="container-fluid px-4">
      <div className="mt-4 d-flex justify-content-between align-items-center">
        <div>
          <h1>Destaques da Home</h1>

          <p className="text-muted mb-0">
            Organize a ordem em que os imóveis aparecem na página inicial.
          </p>
        </div>

        <button
          className="btn btn-primary"
          type="button"
          onClick={salvarOrdem}
          disabled={salvando || carregando}
        >
          {salvando ? "Salvando..." : "Salvar ordem"}
        </button>
      </div>

      <ol className="breadcrumb mb-4 mt-2">
        <li className="breadcrumb-item active">Destaques da Home</li>
      </ol>

      {carregando ? (
        <div className="text-center py-5">Carregando...</div>
      ) : (
        <>
          {renderizarGrupo("Imóveis para Venda", "venda", venda)}

          {renderizarGrupo("Imóveis para Locação", "locacao", locacao)}

          {renderizarGrupo(
            "Empreendimentos",
            "empreendimentos",
            empreendimentos
          )}
        </>
      )}
    </div>
  );
};