import { Test, TestingModule } from '@nestjs/testing';
import { PembayaranInvoiceController } from './pembayaran-invoice.controller';
import { PembayaranInvoiceService } from './pembayaran-invoice.service';

describe('PembayaranInvoiceController', () => {
  let controller: PembayaranInvoiceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PembayaranInvoiceController],
      providers: [PembayaranInvoiceService],
    }).compile();

    controller = module.get<PembayaranInvoiceController>(PembayaranInvoiceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
