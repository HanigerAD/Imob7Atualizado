import {
  converterBooleanParaString,
  converterStringParaBoolean,
} from "../../utils/parser.utils";

type SeletorBooleanoGenericoProps = {
  value: any;
  onChange: (value: any) => void;
  id: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  classNameSelect?: string;
  classNameSelectOption?: string;
};

export const SeletorBooleanoGenerico = ({
  value,
  onChange,
  id,
  label,
  required = false,
  disabled = false,
  className = "",
  classNameSelect = "",
  classNameSelectOption = "",
  placeholder = "",
}: SeletorBooleanoGenericoProps) => {
  const onChangeValue = (e: any) => {
    e.preventDefault();
    const newValue = converterStringParaBoolean(e.target.value);
    onChange(newValue);
  };

  const RenderOptions = ({ className, ...restProps }: any) => {
    return (
      <option
        className={`${className} ${classNameSelectOption}`}
        {...restProps}
      />
    );
  };

  return (
    <>
      <div className={`form-floating mb-3 ${className}`}>
        <select
          className={`form-control ${classNameSelect}`}
          id={id}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          value={converterBooleanParaString(value)}
          onChange={onChangeValue}
        >
          <RenderOptions value={""} disabled>
            Selecione...
          </RenderOptions>
          <RenderOptions value={"true"}>Sim</RenderOptions>
          <RenderOptions value={"false"}>Não</RenderOptions>
        </select>
        <label htmlFor={id}>{label}</label>
      </div>
    </>
  );
};
