import { useEffect, useState } from "react";
import { useTypes } from "../../../hooks/useTypes";

type ImoveisFiltrosProps = {
  buscar: (filters?: any) => Promise<void>;
};

export const ImoveisFiltros = ({ buscar }: ImoveisFiltrosProps) => {
  const [filtro, setFiltro] = useState({} as any);
  const { types, buscarTiposDeImovel } = useTypes([]);

  function atualizarFiltro(chave: string, valor: any) {
    setFiltro((filtroAnt: any) => {
      const newFiltro = { ...filtroAnt, [chave]: valor };
      return newFiltro;
    });
  }

  function manipularEnvio(event: any) {
    event.preventDefault();
    let filters = Object.assign({}, filtro);

    for (var propName in filters) {
      if (filters[propName] === '' || filters[propName] === null || filters[propName] === undefined) {
        delete filters[propName];
      }
    }

    if (filters.type) {
      filters.type = filters.type.code;
    }

    buscar(filters);
  }

  useEffect(() => {
    buscarTiposDeImovel();
  }, []);

  return (
    <div className="card mb-4">
      <div className="card-header">Filtros</div>

      <div className="card-body">
        <form onSubmit={manipularEnvio} className="row g-3">
          <div className="col-auto">
            <div className="input-group mb-3">
              <label className="input-group-text" htmlFor="input-code">
                Código
              </label>
              <input
                className="form-control"
                id="input-code"
                type="number"
                placeholder="Código"
                value={filtro.code || ""}
                onChange={(event) =>
                  atualizarFiltro("code", event.target.value)
                }
              />
            </div>
          </div>

          <div className="col-auto">
            <div className="input-group mb-3">
              <label className="input-group-text" htmlFor="input-internalCode">
                Código Interno
              </label>
              <input
                className="form-control"
                id="input-internalCode"
                type="number"
                placeholder="Código Interno"
                value={filtro.internalCode || ""}
                onChange={(event) =>
                  atualizarFiltro("internalCode", event.target.value)
                }
              />
            </div>
          </div>

          <div className="col-auto">
            <div className="input-group mb-3">
              <label className="input-group-text" htmlFor="input-type">
                Tipo
              </label>
              <select
                className="form-control"
                id="input-type"
                placeholder="Tipo"
                value={filtro?.type?.code || ""}
                onChange={(event) =>
                  atualizarFiltro(
                    "type",
                    types.find(({ code }) => code == event.target.value) || null
                  )
                }
              >
                <option value={""}>Selecione...</option>
                {types.map((type: any) => (
                  <option key={type.code} value={type.code}>
                    {type.description}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="col-auto">
            <button type="submit" className=" btn btn-success">
              Buscar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
