import {Injectable} from "@nestjs/common";
import {BannerRepository} from "../repository/banner.repository";
import {BannerMapper} from "../mapper/banner.mapper";
import {BannerResponse} from "../integration/response/banner.response";
import {ImageService} from "../../common/service/image.service";
import {ImageRequest} from '../../common/integration/request/image.request';
import {Builder} from 'builder-pattern';
import {ImageSizeEnum} from '../../common/enum/image-size.enum';

@Injectable()
export class BannerService {
    constructor(
        private repository: BannerRepository,
        private imageService: ImageService
    ) {
    }

    public async insert(file: Express.Multer.File, res): Promise<number> {
        return this.imageService.saveImages(Array.of(this.buildBannerImage(file)))
            .then(() => this.repository.insert(file.filename));
    }

    public getAll(): Promise<BannerResponse[]> {
        return this.repository.getAll()
            .then(banners => BannerMapper.entityListToResponse(banners));
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



