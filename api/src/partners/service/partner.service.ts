import { PartnerRepository } from "../repository/partner.repository";
import { Injectable } from "@nestjs/common";
import { PartnerRequest } from "../integration/request/partner.request";
import { PartnerMapper } from "../mapper/partner.mapper";
import { PartnerResponse } from "../integration/response/partner.response";
import { ImageService } from "src/common/service/image.service";
import { ImageRequest } from "src/common/integration/request/image.request";
import { Builder } from "builder-pattern";
import { ImageSizeEnum } from "src/common/enum/image-size.enum";
import { Response } from "express";

@Injectable()
export class PartnerService {
  constructor(
    private repository: PartnerRepository,
    private imageService: ImageService
  ) {}

  public insert(request: PartnerRequest): Promise<number> {
    return this.repository.insert(PartnerMapper.requestToEntity(request));
  }

  public getAll(): Promise<PartnerResponse[]> {
    return this.repository
      .getAll()
      .then((Partners) => PartnerMapper.entityListToResponse(Partners));
  }

  public getSingle(code: number): Promise<PartnerResponse> {
    return this.repository
      .getSingle(code)
      .then((Partner) => PartnerMapper.entityToResponse(Partner));
  }

  public setImage(
    code: number,
    image: Express.Multer.File,
    res: Response
  ): Promise<number> {
    return this.imageService
      .saveImages(Array.of(this.buildPartnerImage(image)))
      .then(() => this.repository.setImage(code, image.filename));
  }

  public update(code: number, request: PartnerRequest): Promise<number> {
    return this.repository.update(code, PartnerMapper.requestToEntity(request));
  }

  public delete(code: number): Promise<number> {
    return this.repository.delete(code);
  }

  public buildPartnerImage(file: Express.Multer.File): ImageRequest {
    return Builder<ImageRequest>()
      .file(file)
      .width(ImageSizeEnum.PARTNER_WIDTH)
      .height(ImageSizeEnum.PARTNER_HEIGHT)
      .build();
  }
}
