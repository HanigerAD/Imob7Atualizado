import {Injectable} from "@nestjs/common";
import {PostRepository} from "../repository/post.repository";
import {PostRequest} from "../integration/request/post.request";
import {PostMapper} from "../mapper/post.mapper";
import {PostResponse} from "../integration/response/post.response";
import {UserResponse} from "../integration/response/user.response";
import {UserMapper} from "../mapper/user.mapper";
import {PostBuilder} from "../builder/post.builder";
import {ImageService} from "../../common/service/image.service";
import {ImageRequest} from '../../common/integration/request/image.request';
import {Builder} from 'builder-pattern';
import {ImageSizeEnum} from '../../common/enum/image-size.enum';
import {Response} from 'express';

@Injectable()
export class PostService {
    constructor(
        private repository: PostRepository,
        private imageService: ImageService
    ) {
    }

    public insert(request: PostRequest): Promise<number> {
        return this.repository.insert(PostMapper.requestToEntity(request))
    }

    public getAll(): Promise<PostResponse[]> {
        return this.repository.getAll()
            .then(posts => PostMapper.entityListToResponse(posts));
    }

    public getSingle(code: number): Promise<PostResponse> {
        const builder = new PostBuilder();
        let post: PostResponse;
        return this.repository.getSingle(code)
            .then(result => post = PostMapper.entityToResponse(result))
            .then(() => builder.postData(post))
            .then(() => this.getUser(code))
            .then(user => builder.user(user))
            .then(() => builder.build());
    }

    private getUser(code: number): Promise<UserResponse> {
        return this.repository.getUser(code)
            .then(user => UserMapper.entityToResponse(user));
    }

    public update(code: number, request: PostRequest): Promise<number> {
        return this.repository.update(code, PostMapper.requestToEntity(request));
    }

    public delete(code: number): Promise<number> {
        return this.repository.delete(code);
    }

    public setImage(code: number, image: Express.Multer.File, res: Response): Promise<number> {
        return this.imageService.saveImages(Array.of(this.buildPostImage(image)))
            .then(() => this.repository.setImage(code, image.filename))
    }

    public getSellCounter(): Promise<number> {
        return this.repository.postCounter()
            .then(result => result[0].registers);
    }

    public buildPostImage(file: Express.Multer.File): ImageRequest {
        return Builder<ImageRequest>()
            .file(file)
            .width(ImageSizeEnum.POST_WIDTH)
            .height(ImageSizeEnum.POST_HEIGHT)
            .build()
    }
}
