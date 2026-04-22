import {PostRequest} from "../integration/request/post.request";
import {PostEntity} from "../entity/post.entity";
import {Builder} from "builder-pattern";
import {DateTime} from "luxon";
import {PostResponse} from "../integration/response/post.response";

export class PostMapper {
    public static requestToEntity(request: PostRequest): PostEntity {
        return Builder<PostEntity>()
            .titulo(request.title)
            .texto(request.text)
            .keywords(request.keywords)
            .data_cadastro((new Date()).toISOString().slice(0, 18))
            .usuario(request.user)
            .build()
    }

    public static entityToResponse(entity: PostEntity): PostResponse {
        return Builder<PostResponse>()
            .code(entity.codigo)
            .title(entity.titulo)
            .text(entity.texto)
            .createDate(entity.data_cadastro)
            .keywords(entity.keywords)
            .image(entity.imagem)
            .build()
    }

    public static entityListToResponse(entities: PostEntity[]): PostResponse[] {
        return entities.map(entity => this.entityToResponse(entity));
    }
}
