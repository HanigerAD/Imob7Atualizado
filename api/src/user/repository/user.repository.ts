import { Injectable } from "@nestjs/common";
import { InjectKnex, Knex } from "nestjs-knex";
import { from, Observable } from "rxjs";
import { UserEntity } from "../entity/user.entity";
import { SituationEntity } from "../entity/situation.entity";
import { PermissionEntity } from "../entity/permission.entity";
import { UserPermissionEntity } from "../entity/user-permission.entity";
import { SituationEnum } from "../../common/enum/situation.enum";

@Injectable()
export class UserRepository {
    constructor(
        @InjectKnex() private readonly knex: Knex
    ) {
    }

    public insert(entity: UserEntity): Promise<number[]> {
        return this.knex
            .insert(entity)
            .into('usuario');
    }

    public insertPermissions(entities: UserPermissionEntity[]): Promise<number[]> {
        return this.knex
            .insert(entities)
            .into('permissao_usuario');
    }

    public getAll(filter: UserEntity): Observable<UserEntity[]> {
        return from(
            this.knex
                .select('codigo', 'nome', 'email')
                .from('usuario')
                .where(filter)
        );
    }

    public getSingle(code: number): Promise<UserEntity> {
        return this.knex
            .select('codigo', 'nome', 'email')
            .from('usuario')
            .where('codigo', '=', code)
            .first();
    }

    public getSituation(code: number): Promise<SituationEntity> {
        return this.knex
            .select('situacao.*')
            .from('usuario')
            .joinRaw('JOIN situacao ON situacao.codigo = usuario.situacao')
            .where('usuario.codigo', '=', code)
            .first()
    }

    public getSituations(): Promise<SituationEntity[]> {
        return this.knex
            .select('*')
            .from('situacao')
    }

    public getUserPermissions(code: number): Promise<PermissionEntity[]> {
        return this.knex
            .select('permissao.*')
            .from('usuario')
            .joinRaw('JOIN permissao_usuario ON permissao_usuario.usuario = usuario.codigo')
            .joinRaw('JOIN permissao ON permissao.codigo = permissao_usuario.permissao')
            .where('usuario.codigo', '=', code);
    }

    public update(code: number, entity: UserEntity): Promise<number> {
        return this.knex
            .update(entity)
            .from('usuario')
            .where('codigo', '=', code);
    }

    public updatePassword(code: number, password: string): Observable<number> {
        return from(
            this.knex
                .update({ senha: password })
                .from('usuario')
                .where('codigo', '=', code)
        );
    }

    public async delete(code: number): Promise<number> {
        return this.knex.transaction(
            (trx) => {
                return this.knex
                    .delete()
                    .from('blog')
                    .where('usuario', code)
                    .transacting(trx)
                    .then(
                        () => this.knex
                            .delete()
                            .from('permissao_usuario')
                            .where('usuario', code)
                            .transacting(trx)
                            .then(
                                () => this.knex
                                    .delete()
                                    .from('usuario')
                                    .where('codigo', code)
                                    .transacting(trx)
                            )
                    )
                    .catch(trx.rollback)
            }
        );
    }

    public deletePermissions(code: number): Promise<number> {
        return this.knex
            .delete()
            .from('permissao_usuario')
            .where('usuario', '=', code)
    }

    public getPermissions(): Promise<PermissionEntity[]> {
        return this.knex
            .select()
            .from('permissao');
    }

    public userCounter(): Promise<number> {
        return this.knex
            .select()
            .from('usuario')
            .count('* as registers')
    }
}
