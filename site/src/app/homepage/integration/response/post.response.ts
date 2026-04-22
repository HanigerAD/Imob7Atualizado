
import { UserResponse } from './user.response';

export class PostResponse {
    public code?: number;
    public title?: string;
    public text?: string;
    public keywords?: string;
    public createDate?: string;
    public image?: string;
    public user?: UserResponse;
}
