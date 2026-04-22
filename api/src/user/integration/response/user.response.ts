import {SituationResponse} from "./situation.response";
import {PermissionResponse} from "./permission.response";

export class UserResponse {
    public code?: number;
    public name?: string;
    public email?: string;
    public situation?: SituationResponse;
    public permission?: PermissionResponse[]
}