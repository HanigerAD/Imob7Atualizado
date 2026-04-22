import { IsDate, IsIn, IsNotEmpty, IsNumber, IsOptional, Length } from "class-validator";

export class PropertyRequest {
  @IsNotEmpty({ message: 'Codigo interno deve ser preenchido.' })
  @IsNumber({}, { message: 'Codigo interno deve conter o numero do seu identificado' })
  public internalCode: number;

  @IsNotEmpty({ message: 'Titulo deve ser preenchido.' })
  @Length(3, 255, { message: 'Titulo deve conter de 3 a 255 caracteres' })
  public title: string;

  @IsNotEmpty({ message: 'Tipo deve ser preenchido.' })
  @IsNumber({}, { message: 'Tipo deve conter o numero do seu identificado' })
  public type: number;

  @IsNotEmpty({ message: 'Categoria deve ser preenchido.' })
  @IsNumber({}, { message: 'Categoria deve conter o numero do seu identificado' })
  public category: number;

  @IsNotEmpty({ message: 'Perfil deve ser preenchido.' })
  @IsNumber({}, { message: 'Perfil deve conter o numero do seu identificado' })
  public profile: number;

  @IsNotEmpty({ message: 'Estado de conservacao deve ser preenchido.' })
  @IsNumber({}, { message: 'Estado de conservacao deve conter o numero do seu identificado' })
  public conservationState: number;

  @IsNotEmpty({ message: 'Zona deve ser preenchido.' })
  @IsNumber({}, { message: 'Zona deve conter o numero do seu identificado' })
  public zone: number;

  @IsNotEmpty({ message: 'Corretor deve ser preenchido.' })
  @IsNumber({}, { message: 'Corretor deve conter o numero do seu identificado' })
  public agent: number;

  @IsNotEmpty({ message: 'Exibir deve ser preenchido.' })
  @IsIn([0, 1], { message: 'Exibir deve ser um booleano' })
  @IsNotEmpty({ message: 'Reservado deve ser preenchido.' })
  @IsIn([0, 1], { message: 'Reservado deve ser um booleano' })
  public show: number;

  @IsNotEmpty({ message: 'Preco deve ser preenchido.' })
  @Length(1, 13, { message: 'Preco deve ser no minimo R$ 0 e maximo de R$ 1.000.000.000,00' })
  public price: string;

  @IsOptional()
  @IsNumber({}, { message: 'Dormitorios deve ser um numero' })
  public dormitory?: number;

  @IsNotEmpty({ message: 'Unidade Disponível deve ser preenchido.' })
  @IsIn([0, 1], { message: 'Unidade Disponível deve ser um booleano' })
  public unitAvailable: number;

  @IsOptional()
  @IsNumber({}, { message: 'Banheiros deve ser um numero' })
  public bathroom?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Vagas de Garagem deve ser um numero' })
  public parkingVacancy?: number;

  @IsOptional()
  @Length(1, 255, { message: 'Area Privativa deve conter de 1 a 255 caracteres' })
  public privativeArea?: string;

  @IsOptional()
  @Length(1, 255, { message: 'Area Total deve conter de 1 a 255 caracteres' })
  public totalArea?: string;

  @IsNotEmpty({ message: 'Pavimentacao deve ser preenchido.' })
  @IsIn([0, 1], { message: 'Pavimentacao deve ser um booleano' })
  public pavement: number;

  @IsNotEmpty({ message: 'Financiavel deve ser preenchido.' })
  @IsIn([0, 1], { message: 'Financiavel deve ser preenchido.' })
  public financeable: number;

  @IsNotEmpty({ message: 'Descricao deve ser preenchido.' })
  @Length(1, 65535, { message: 'Descricao deve conter de 1 a 65,535 caracteres' })
  public description: string;

  @IsOptional()
  @Length(1, 255, { message: 'Informacoes Privadas deve conter de 1 a 255 caracteres' })
  public privateInfo?: string;

  @IsNotEmpty({ message: 'Reservado deve ser preenchido.' })
  @IsIn([0, 1], { message: 'Reservado deve ser um booleano' })
  public reserved: number;

  @IsOptional()
  @Length(1, 255, { message: 'Hectare deve conter de 1 a 255 caracteres' })
  public hectare?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Ano de Conservacao deve conter de 1 a 4 caracteres' })
  public constuctionYear?: number;

  @IsNotEmpty({ message: 'Destaque deve ser preenchido.' })
  @IsIn([0, 1], { message: 'Destaque deve ser um booleano' })
  public featured?: number;

  @IsNotEmpty({ message: 'Super Destaque deve ser preenchido.' })
  @IsIn([0, 1], { message: 'Super Destaque deve ser um booleano' })
  public superFeatured?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Suites deve ser um numero' })
  public suite?: number;

  @IsNotEmpty({ message: 'Alugado deve ser preenchido.' })
  @IsIn([0, 1], { message: 'Alugado deve ser um booleano' })
  public rented?: number;

  @IsNotEmpty({ message: 'Preco do condominio deve ser preenchido.' })
  @Length(1, 13, { message: 'Preco do condominio deve ser no minimo R$ 0 e maximo de R$ 1.000.000.000,00' })
  public condominiumPrice?: string;

  @IsNotEmpty({ message: 'Exibir Valor deve ser preenchido.' })
  @IsIn([0, 1], { message: 'Exibir Valor deve ser um booleano' })
  public showValue?: number;

  @IsOptional()
  @Length(1, 13, { message: 'CEP deve ser preenchido corretamente de acordo com 88888-888' })
  public zipCode?: string;

  @IsNotEmpty({ message: 'Bairro deve ser preenchido.' })
  public neighborhood?: number;

  @IsOptional()
  @Length(1, 255, { message: 'Logradouro deve conter de 1 a 255 caracteres.' })
  public street?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Numero deve ser um numero' })
  public number?: number;

  @IsOptional()
  @Length(1, 255, { message: 'Complemento deve conter de 1 a 255 caracteres.' })
  public complement?: string;

  @IsOptional()
  @Length(1, 255, { message: 'latitude deve ser preenchido.' })
  public latitude?: string;

  @IsOptional()
  @Length(1, 255, { message: 'longitude deve ser preenchido.' })
  public longitude?: string;

  @IsNotEmpty({ message: 'Transacao deve ser preenchido.' })
  public transaction: number;

  @IsNotEmpty({ message: 'Situacao deve ser preenchido.' })
  public situation: number;

  @IsOptional()
  @Length(0, 255, { message: 'link do Youtube deve conter de 0 a 255 caracteres.' })
  public linkYoutube?: string;
}
