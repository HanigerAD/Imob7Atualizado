import {InjectKnex, Knex} from "nestjs-knex";
import {PostEntity} from "../entity/post.entity";
import {UserEntity} from "../entity/user.entity";
import {TransactionEnum} from '../../common/enum/transaction.enum';

export class PostRepository {
    constructor(
        @InjectKnex() private readonly knex: Knex
    ) {
    }

    public insert(entity: PostEntity): Promise<number> {
        return this.knex
            .insert(entity)
            .into('blog');
    }

    public getAll(): Promise<PostEntity[]> {
        return this.knex
            .select('*')
            .from('blog');
    }

    public getSingle(code: number): Promise<PostEntity> {
        return this.knex
            .select('*')
            .from('blog')
            .where('codigo', '=', code)
            .first();
    }

    public update(code: number, entity: PostEntity): Promise<number> {
        return this.knex
            .update(entity)
            .from('blog')
            .where('codigo', '=', code);
    }

    public delete(code: number): Promise<number> {
        return this.knex
            .delete()
            .from('blog')
            .where('codigo', '=', code);
    }

    public getUser(code: number): Promise<UserEntity> {
        return this.knex
            .select('usuario.*')
            .from('blog')
            .joinRaw('JOIN usuario ON usuario.codigo = blog.usuario')
            .where('blog.codigo', '=', code)
            .first();
    }

    public setImage(code: number, image: string): Promise<number> {
        return this.knex
            .update({imagem: image})
            .from('blog')
            .where('codigo', '=', code);
    }

    public postCounter(): Promise<number> {
        return this.knex
            .select()
            .from('blog')
            .count('* as registers')
    }
}
