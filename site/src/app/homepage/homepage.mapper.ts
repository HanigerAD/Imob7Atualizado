
import { Builder } from 'builder-pattern';

import { PostResponse } from './integration/response/post.response';
import { PostModel } from './model/post.model';
import { UserResponse } from './integration/response/user.response';
import { UserModel } from './model/user.model';

export class HomepageMapper {

    public static mapPostResponseArrayToModel(response: PostResponse[]): PostModel[] {
        return response.map(post => this.mapPostResponseToModel(post));
    }

    public static mapPostResponseToModel(response: PostResponse): PostModel {
        return Builder<PostModel>()
            .code(response.code)
            .title(response.title)
            .text(`${response.text}`) // ``
            .keywords(response.keywords.split(';').filter(keyword => keyword.length))
            .createDate(response.createDate)
            .image(response.image)
            .user(response.user ? this.mapUserResponseToModel(response.user) : null)
        .build();
    }

    public static mapUserResponseToModel(response: UserResponse): UserModel {
        return Builder<UserModel>()
            .code(response.code)
            .name(response.name)
            .email(response.email)
        .build();
    }

}
