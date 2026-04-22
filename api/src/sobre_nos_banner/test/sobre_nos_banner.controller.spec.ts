import { Test, TestingModule } from '@nestjs/testing';
import { SobreNosBannerController } from '../controller/sobre_nos_banner.controller';

describe('SobreNosBannerController', () => {
  let controller: SobreNosBannerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SobreNosBannerController],
    }).compile();

    controller = module.get<SobreNosBannerController>(SobreNosBannerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
