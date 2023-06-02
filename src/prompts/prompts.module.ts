import { Module } from '@nestjs/common';
import { PromptsService } from './prompts.service';
import { PromptsController } from './prompts.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [PromptsController],
  providers: [PromptsService],
  imports: [PrismaModule],
})
export class PromptsModule {}
