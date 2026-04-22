import {InjectKnex, Knex} from "nestjs-knex";
import {NewPropertyEntity} from "../entity/new-property.entity";
import {MessageEntity} from "../entity/message.entity";

export class ContactRepository {
    constructor(
        @InjectKnex() private readonly knex: Knex
    ) {
    }

    public insertNewPropertyContact(entity: NewPropertyEntity): Promise<number> {
        return this.knex
            .insert(entity)
            .into('novos_imoveis');
    }

    public getAllNewPropertiesContacts(): Promise<NewPropertyEntity[]> {
        return this.knex
            .select('*')
            .from('novos_imoveis');
    }

    public getSingleNewPropertyContact(code: number): Promise<NewPropertyEntity> {
        return this.knex
            .select('*')
            .from('novos_imoveis')
            .where('codigo', '=', code)
            .first();
    }

    public updateNewPropertyContact(code: number, entity: NewPropertyEntity): Promise<number> {
        return this.knex
            .update(entity)
            .from('novos_imoveis')
            .where('codigo', '=', code);
    }

    public deleteNewPropertiesContact(code: number): Promise<number> {
        return this.knex
            .delete()
            .from('novos_imoveis')
            .where('codigo', '=', code);
    }

    public newPropertiesContactsCounter(): Promise<number> {
        return this.knex
            .select()
            .from('novos_imoveis')
            .count('* as registers');
    }

    public insertMessage(entity: MessageEntity): Promise<number> {
        return this.knex
            .insert(entity)
            .into('mensagens');
    }

    public getAllMessages(): Promise<MessageEntity[]> {
        return this.knex
            .select('*')
            .from('mensagens');
    }

    public getSingleMessage(code: number): Promise<MessageEntity> {
        return this.knex
            .select('*')
            .from('mensagens')
            .where('codigo', '=', code)
            .first();
    }

    public updateMessage(code: number, entity: MessageEntity): Promise<number> {
        return this.knex
            .update(entity)
            .from('mensagens')
            .where('codigo', '=', code);
    }

    public deleteMessage(code: number): Promise<number> {
        return this.knex
            .delete()
            .from('mensagens')
            .where('codigo', '=', code);
    }

    public messagesCounter(): Promise<number> {
        return this.knex
            .select()
            .from('mensagens')
            .count('* as registers');
    }
}
