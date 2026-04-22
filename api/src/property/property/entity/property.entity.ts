export class PropertyEntity {

  public titulo?: string;
  public codigo?: number;
  public codigo_interno?: number;
  public valor?: string;
  public transacao?: string;
  public foto?: string;
  public dormitorio?: number;
  public vaga?: number;

  public areaTotal?: string;
  public hectares?: string;
  public bairro?: string;
  public municipio?: string;
  public zona?: string;
  public categoria?: string;
  public uf?: string;
  public financiavel?: number;

  // ===============================
  // CAMPOS EXIGIDOS PELO FEED XML
  // ===============================

  public tipo_imovel?: number;         // ADICIONADO
  public categoria_nome?: string;      // ADICIONADO

  public perfil?: string;
  public valor_condominio?: string;
  public area_total?: string;
  public area_privativa?: string;
  public area_util?: string;           // ADICIONADO

  public suite?: number;
  public banheiro?: number;

  public cep?: string;
  public logradouro?: string;
  public numero?: string;
  public complemento?: string;

  public descricao?: string;
  public latitude?: string;
  public longitude?: string;

  public data_atualizacao?: Date;

  public destaque?: number;            // ADICIONADO
  public valor_locacao?: string;       // ADICIONADO
  public valor_iptu?: string;          // ADICIONADO

  public esconder_endereco_imovel?: number; // ADICIONADO

  // Fotos
  public fotos?: string[];
}
