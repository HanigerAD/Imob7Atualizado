import { Injectable } from "@nestjs/common";
import { UserRepository } from "../repository/user.repository";
import { Observable } from "rxjs";
import { UserMapper } from "../mapper/user.mapper";
import { UserRequest } from "../integration/request/user.request";
import { map } from "rxjs/operators";
import { UserResponse } from "../integration/response/user.response";
import { UserBuilder } from "../builder/user.builder";
import { PermissionMapper } from "../mapper/permission.mapper";
import { PermissionResponse } from "../integration/response/permission.response";
import { SituationMapper } from "../mapper/situation.mapper";
import { SituationResponse } from "../integration/response/situation.response";
import { UserPermissionMapper } from "../mapper/user-permission.mapper";
import { PasswordRequest } from "../integration/request/password.request";
import { UserDto } from "../DTO/userDto";


@Injectable()
export class UserService {
    constructor(
        private repository: UserRepository
    ) {
    }

    public insert(request: UserRequest): Promise<number> {
        let userCode: number;
        return this.repository.insert(UserMapper.requestToEntity(request))
            .then(result => userCode = result.shift())
            .then(() => this.insertPermissions(request.permission, userCode))
            .then(() => userCode);
    }

    public insertPermissions(permissions: number[], userCode: number): Promise<number[]> {
        return this.repository.insertPermissions(UserPermissionMapper.requestToEntity(permissions, userCode));
    }

    public getAll(filter: UserDto): Observable<UserResponse[]> {
        return this.repository.getAll(UserMapper.dtoToEntity(filter)).pipe(
            map(results => UserMapper.entityListToResponse(results))
        );
    }

    public getSingle(code: number): Promise<UserResponse> {
        const builder = new UserBuilder();
        let user: UserResponse;
        return this.getUserData(code)
            .then(userData => user = userData)
            .then(() => builder.userData(user))
            .then(() => this.getSituation(user.code))
            .then(situation => builder.situation(situation))
            .then(() => this.getUserPermissions(user.code))
            .then(permissions => builder.permissions(permissions))
            .then(() => builder.build());
    }

    public getUserData(code: number): Promise<UserResponse> {
        return this.repository.getSingle(code).then(user => UserMapper.entityToResponse(user));
    }

    public getSituation(code: number): Promise<SituationResponse> {
        return this.repository.getSituation(code).then(situation => SituationMapper.entityToResponse(situation));
    }

    public getSituations(): Promise<SituationResponse[]> {
        return this.repository.getSituations().then(
            situations => situations.map(
                situation => SituationMapper.entityToResponse(situation)
            )
        );
    }

    public getUserPermissions(code: number): Promise<PermissionResponse[]> {
        return this.repository.getUserPermissions(code).then(permissions => PermissionMapper.entityListToResponse(permissions))
    }

    public update(code: number, request: UserRequest): Promise<number> {
        delete request.password;
        return this.repository.update(code, UserMapper.requestToEntity(request))
            .then(() => this.deletePermissions(code))
            .then(() => this.insertPermissions(request.permission, code))
            .then(() => code);
    }

    public updatePassword(code: number, password: PasswordRequest): Observable<number> {
        return this.repository.updatePassword(code, password.password);
    }

    public async delete(code: number): Promise<number> {
        return this.repository.delete(code);
    }

    public deletePermissions(code: number): Promise<number> {
        return this.repository.deletePermissions(code);
    }

    public getPermissions(): Promise<PermissionResponse[]> {
        return this.repository.getPermissions()
            .then(permissions => PermissionMapper.entityListToResponse(permissions));
    }

    public getUserCounter(): Promise<number> {
        return this.repository.userCounter()
            .then(result => result[0].registers);
    }
}
