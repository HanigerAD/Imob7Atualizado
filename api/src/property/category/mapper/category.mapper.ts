import { CategoryResponse } from './../integration/response/category.response';
import { CategoryEntity } from '../entity/category.entity';
import { Builder } from "builder-pattern";
import { CategoryRequest } from '../integration/response/category.request';

export class CategoryMapper {
    public static requestToEntity(request: CategoryRequest): CategoryEntity {
        return Builder<CategoryEntity>()
            .descricao(request.description)
            .build()
    }

    public static entityToResponse(entity: CategoryEntity): CategoryResponse {
        return Builder<CategoryResponse>()
            .code(entity.codigo)
            .description(entity.descricao)
            .build();
    }

    public static entityListToResponse(entities: CategoryEntity[]): CategoryResponse[] {
        return entities.map(entity => this.entityToResponse(entity));
    }
}
