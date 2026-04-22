import { Builder } from "builder-pattern";

import { PropertyDocumentResponse } from "../integration/response/property-document.response";
import { PropertyDocumentEntity } from "../entity/property-document.entity";

export class PropertyDocumentMapper {

    public static mapPropertyDocumentEntityToResponse(entity: PropertyDocumentEntity): PropertyDocumentResponse {
        return Builder<PropertyDocumentResponse>()
            .code(entity.codigo)
            .property(entity.imovel)
            .document(entity.documento)
            .filename(entity.nome_arquivo)
        .build();
    }

}
