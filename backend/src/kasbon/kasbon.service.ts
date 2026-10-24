
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateKasbonDto } from './dto/create-kasbon.dto';
import { UpdateKasbonDto } from './dto/update-kasbon.dto';

@Injectable()
export class KasbonService {
  constructor(private readonly prisma: PrismaService) { }


  create(createKasbonDto: CreateKasbonDto) {
    return this.prisma.kasbonOperasional.create({
      data: {
        ...createKasbonDto,
        tanggal: new Date(`${createKasbonDto.tanggal}T00:00:00.000Z`),
      },
    });
  }


  findAll() {
    return this.prisma.kasbonOperasional.findMany({
      include: {
        karyawan: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.kasbonOperasional.findUnique({
      where: { id_kasbon_operasional: id },
      include: {
        karyawan: true,
      },
    });
  }

  update(id: number, updateKasbonDto: UpdateKasbonDto) {
    return this.prisma.kasbonOperasional.update({
      where: { id_kasbon_operasional: id },
      data: updateKasbonDto,
    });
  }

  remove(id: number) {
    return this.prisma.kasbonOperasional.delete({
      where: { id_kasbon_operasional: id },
    });
  }
}
