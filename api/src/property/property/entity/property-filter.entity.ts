import { PaginationEntity } from "./pagination.entity";
import { PriceFilterEntity } from "./price-filter.entity";

export class PropertyFilterEntity {
    public codigo?: number;
    public codigo_interno?: number;
    public transacao?: number;
    public tipo?: number;
    public municipio?: number;
    public bairro?: string[];
    public zona?: number;
    public hectare?: number;
    public preco?: PriceFilterEntity;
    public paginacao?: PaginationEntity;
    public financiavel?: number;
    public categoria?: string;
    public exibir?: number;
    public banheiro?: number;
    public vaga?: number;
    public dormitorio?: number;
    public agenciador?: number;
}
