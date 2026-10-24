import { Test, TestingModule } from '@nestjs/testing';
import { MutasiBatchService } from './mutasi-batch.service';

describe('MutasiBatchService', () => {
  let service: MutasiBatchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MutasiBatchService],
    }).compile();

    service = module.get<MutasiBatchService>(MutasiBatchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
