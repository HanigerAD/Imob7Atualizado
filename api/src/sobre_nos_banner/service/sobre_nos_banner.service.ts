import { Injectable } from "@nestjs/common";
import { SobreNosBannerRepository } from "../repository/sobre_nos_banner.repository";
import { SobreNosBannerMapper } from "../mapper/sobre_nos_banner.mapper";
import { SobreNosBannerResponse } from "../integration/response/sobre_nos_banner.response";
import { ImageService } from "../../common/service/image.service";
import { ImageRequest } from '../../common/integration/request/image.request';
import { Builder } from 'builder-pattern';
import { ImageSizeEnum } from '../../common/enum/image-size.enum';

@Injectable()
export class SobreNosBannerService {
  constructor(
    private repository: SobreNosBannerRepository,
    private imageService: ImageService
  ) {
  }

  public async insert(file: Express.Multer.File): Promise<number> {
    const images = Array.of(this.buildBannerImage(file));
    await this.imageService.saveImages(images);
    const insertedId = this.repository.insert(file.filename);
    return insertedId;
  }

  public getAll(): Promise<SobreNosBannerResponse[]> {
    return this.repository.getAll()
      .then(banners => SobreNosBannerMapper.entityListToResponse(banners));
  }

  public delete(image: string): Promise<number> {
    return this.repository.delete(image);
  }

  public buildBannerImage(file: Express.Multer.File): ImageRequest {
    return Builder<ImageRequest>()
      .file(file)
      .width(ImageSizeEnum.BANNER_WIDTH)
      .height(ImageSizeEnum.BANNER_HEIGHT)
      .build()
  }
}



