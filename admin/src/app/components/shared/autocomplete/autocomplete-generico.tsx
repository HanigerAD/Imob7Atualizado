import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { apiService } from "../../../services/api.service";

type AutocompleteGenericoProps = {
  value: any;
  onChange: (value: any) => void;
  id: string;
  endpoint: string;
  idItem: string;
  descricaoItem: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  classNameSelect?: string;
  classNameSelectOption?: string;
};

export const AutocompleteGenerico = ({
  value,
  onChange,
  id,
  endpoint,
  label,
  idItem,
  descricaoItem,
  required = false,
  disabled = false,
  className = "",
  classNameSelect = "",
  classNameSelectOption = "",
  placeholder = "",
}: AutocompleteGenericoProps) => {
  const [processando, setProcessando] = useState(false);
  const [itens, setItens] = useState([]);

  async function buscar() {
    setProcessando(true);
    setItens([]);

    try {
      const resposta = await apiService.get(endpoint);
      setItens(resposta.data);
      setProcessando(false);
    } catch (error) {
      console.log({ error });
      toast.error(`Houve um erro ao buscar registros do campo '${label}'`);
      setProcessando(false);
    }
  }

  const onChangeValue = (e: any) => {
    e.preventDefault();
    const item = itens.find(({ [idItem]: id }) => id == e.target.value);
    onChange(item);
  };

  const RenderOptions = ({ className, ...restProps }: any) => {
    return (
      <option
        className={`${className} ${classNameSelectOption}`}
        {...restProps}
      />
    );
  };

  useEffect(() => {
    buscar();
  }, []);

  return (
    <div className={`form-floating mb-3 ${className}`}>
      <select
        className={`form-control ${classNameSelect}`}
        id={id}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        value={value[idItem] || ""}
        onChange={onChangeValue}
      >
        {!processando ? (
          <>
            {value && value[idItem] ? (
              <RenderOptions
                className="remove-option-selected"
                onClick={() => onChange(null)}
                children={"Remover Seleção"}
              />
            ) : (
              <RenderOptions value={""} disabled children={"Selecione..."} />
            )}
            {itens.map((item: any) => (
              <RenderOptions
                key={item[idItem]}
                value={item[idItem]}
                children={item[descricaoItem]}
              />
            ))}
          </>
        ) : (
          <RenderOptions children={"Carregando..."} />
        )}
      </select>
      <label htmlFor={id}>{label}</label>
    </div>
  );
};
