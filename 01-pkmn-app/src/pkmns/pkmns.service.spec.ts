import { Test, TestingModule } from '@nestjs/testing';
import { PkmnsService } from './pkmns.service';

describe('PkmnsService', () => {
  let service: PkmnsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PkmnsService],
    }).compile();

    service = module.get<PkmnsService>(PkmnsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
