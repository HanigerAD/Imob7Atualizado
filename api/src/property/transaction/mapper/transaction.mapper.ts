import { TransactionEntity } from '../entity/transaction.entity';
import { TransactionResponse } from '../integration/response/transaction.response';
import { Builder } from 'builder-pattern';

export class TransactionMapper {
    public static entityToResponse(entity: TransactionEntity): TransactionResponse {
        return Builder<TransactionResponse>()
            .code(entity.codigo)
            .description(entity.descricao)
            .build();
    }

    public static entityListToResponse(entites: TransactionEntity[]): TransactionResponse[] {
        return entites.map(entity => this.entityToResponse(entity));
    }
}
