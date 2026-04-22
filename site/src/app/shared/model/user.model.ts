import { SituationModel } from './situation.model';
import { PermissionModel } from './permission.model';

export class UserModel {
    public code?: number;
    public name?: string;
    public email?: string;
    public situation?: SituationModel;
    public permission?: PermissionModel[];
}
