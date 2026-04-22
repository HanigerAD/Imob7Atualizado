import { AgentRepository } from "../repository/agent.repository";
import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import { AgentRequest } from "../integration/request/agent.request";
import { AgentMapper } from "../mapper/agent.mapper";
import { AgentResponse } from "../integration/response/agent.response";
import { ImageService } from "src/common/service/image.service";
import { ImageRequest } from "src/common/integration/request/image.request";
import { Builder } from "builder-pattern";
import { ImageSizeEnum } from "src/common/enum/image-size.enum";
import { Response } from "express";
import { PropertyResponse } from "src/property/property/integration/response/property.response";
import { PropertyRepository } from "src/property/property/repository/property.repository";
import { PropertyMapper } from "src/property/property/mapper/property.mapper";

@Injectable()
export class AgentService {
  constructor(
    private repository: AgentRepository,
    private imageService: ImageService,
    private propertyRepository: PropertyRepository
  ) { }

  public insert(request: AgentRequest): Promise<number> {
    return this.repository.insert(AgentMapper.requestToEntity(request));
  }

  public getAll(): Promise<AgentResponse[]> {
    return this.repository
      .getAll()
      .then((agents) => AgentMapper.entityListToResponse(agents));
  }

  public getSingle(code: number): Promise<AgentResponse> {
    return this.repository
      .getSingle(code)
      .then((agent) => AgentMapper.entityToResponse(agent));
  }

  public setImage(
    code: number,
    image: Express.Multer.File,
    res: Response
  ): Promise<number> {
    return this.imageService
      .saveImages(Array.of(this.buildAgentImage(image)))
      .then(() => this.repository.setImage(code, image.filename));
  }

  public update(code: number, request: AgentRequest): Promise<number> {
    return this.repository.update(code, AgentMapper.requestToEntity(request));
  }

  public getProperties(code: number): Promise<PropertyResponse[]> {
    return this.propertyRepository.getAll({ paginacao: { pagina: 1, porPagina: 1000 }, agenciador: code })
      .then(result => PropertyMapper.entityListToResponse(result));
  }

  public async delete(code: number): Promise<number> {
    const properties = await this.getProperties(code);
    console.log({ properties })

    if ((properties && properties.length)) {
      const message = 'Não foi possivel deletar o registro pois o mesmo contem outros registros vinculados.';
      throw new BadRequestException({
        message,
        properties,
      }, message);
    } else {
      try {
        return this.repository.delete(code);
      } catch (error) {
        throw new ConflictException(error, 'Erro ao executar comando no banco de dados')
      }
    }
  }

  public buildAgentImage(file: Express.Multer.File): ImageRequest {
    return Builder<ImageRequest>()
      .file(file)
      .width(ImageSizeEnum.AGENT_WIDTH)
      .height(ImageSizeEnum.AGENT_HEIGHT)
      .build();
  }
}
