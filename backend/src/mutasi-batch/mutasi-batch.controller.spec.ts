import { Test, TestingModule } from '@nestjs/testing';
import { MutasiBatchController } from './mutasi-batch.controller';
import { MutasiBatchService } from './mutasi-batch.service';

describe('MutasiBatchController', () => {
  let controller: MutasiBatchController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MutasiBatchController],
      providers: [MutasiBatchService],
    }).compile();

    controller = module.get<MutasiBatchController>(MutasiBatchController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
