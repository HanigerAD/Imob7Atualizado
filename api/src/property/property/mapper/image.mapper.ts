import { Builder } from 'builder-pattern';

import { PropertyImageEntity } from './../entity/property-image.entity';
import { ImageResponse } from './../integration/response/photo.response';

export class ImageMapper {
    public static entityToResponse(entity: PropertyImageEntity): ImageResponse {
        return Builder<ImageResponse>()
            .index(entity.ordem)
            .url(entity.foto)
            .build()
    }

    public static entityListToResponse(entities: PropertyImageEntity[]): ImageResponse[] {
        return entities.map(entity => this.entityToResponse(entity));
    }
}