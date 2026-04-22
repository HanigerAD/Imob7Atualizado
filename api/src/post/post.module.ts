import { Module } from '@nestjs/common';
import { PostController } from './controller/post.controller';
import {PostService} from "./service/post.service";
import {PostRepository} from "./repository/post.repository";
import {CommomModule} from "../common/commom.module";

@Module({
  controllers: [PostController],
  providers: [
      PostService,
      PostRepository
  ],
    imports: [
        CommomModule
    ]
})
export class PostModule {}
