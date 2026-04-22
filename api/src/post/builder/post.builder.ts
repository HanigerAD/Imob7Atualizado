import {PostResponse} from "../integration/response/post.response";
import {UserResponse} from "../integration/response/user.response";

export class PostBuilder {
    public post: PostResponse;

    constructor() {
        this.post = new PostResponse();
    }

    public static get(): PostResponse {
        return new PostResponse();
    }

    public build(): PostResponse {
        return this.post;
    }

    public postData(post: PostResponse): PostBuilder {
        this.post = post;
        return this;
    }

    public user(user: UserResponse): PostBuilder {
        this.post.user = user;
        return this;
    }
}
