import {Module} from '@nestjs/common';
import {ImageService} from "./service/image.service";
import {DocumentService} from './service/document.service';
import {CdnService} from './service/cdn.service';

@Module({
    providers: [
        ImageService,
        DocumentService,
        CdnService,
    ],
    exports: [
        ImageService,
        DocumentService,
        CdnService
    ]
})
export class CommomModule {
}
