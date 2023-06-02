import { Injectable } from '@nestjs/common';
import { CreatePromptDto } from './dto/create-prompt.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PromptsService {
  constructor(private prisma: PrismaService) {}

  create(createPromptDto: CreatePromptDto) {
    return this.prisma.prompt.create({ data: createPromptDto });
  }

  findAll() {
    return this.prisma.prompt.findMany();
  }

  findAllFailures() {
    return this.prisma.prompt.findMany({ where: { status: 'FAILURE' } });
  }

  findOne(id: number) {
    return this.prisma.prompt.findUnique({ where: { id } });
  }

  remove(id: number) {
    return this.prisma.prompt.delete({ where: { id } });
  }
}
