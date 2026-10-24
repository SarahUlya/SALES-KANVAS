import { Test, TestingModule } from '@nestjs/testing';
import { PembayaranInvoiceService } from './pembayaran-invoice.service';

describe('PembayaranInvoiceService', () => {
  let service: PembayaranInvoiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PembayaranInvoiceService],
    }).compile();

    service = module.get<PembayaranInvoiceService>(PembayaranInvoiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
