import { UserModel } from './user.model';

export class PostModel {
    public code?: number;
    public title?: string;
    public text?: string;
    public keywords?: string[];
    public createDate?: string;
    public image?: string;
    public user?: UserModel;
}
