import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  NotFoundException,
  ParseIntPipe,
  UseFilters,
} from '@nestjs/common';
import { PromptsService } from './prompts.service';
import { CreatePromptDto } from './dto/create-prompt.dto';
import { ApiTags, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { PromptEntity } from './entities/prompt.entity';
import PrismaClientExceptionFilter from 'src/prisma-client-exception/prisma-client-exception.filter';

@ApiTags('prompts')
@Controller('prompts')
@UseFilters(PrismaClientExceptionFilter)
export class PromptsController {
  constructor(private readonly promptsService: PromptsService) {}

  // Create
  @Post()
  @ApiCreatedResponse({ type: PromptEntity })
  create(@Body() createPromptDto: CreatePromptDto) {
    return this.promptsService.create(createPromptDto);
  }

  // Find All
  @Get()
  @ApiOkResponse({ type: [PromptEntity] })
  findAll() {
    return this.promptsService.findAll();
  }

  // Find All Failures
  @Get('failures')
  @ApiOkResponse({ type: [PromptEntity] })
  findAllFailures() {
    return this.promptsService.findAllFailures();
  }

  // Find One
  @Get(':id')
  @ApiOkResponse({ type: PromptEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const prompt = await this.promptsService.findOne(id);
    if (!prompt) {
      throw new NotFoundException(`Prompt #${id} not found`);
    }
    return prompt;
  }

  // Delete
  @Delete(':id')
  @ApiOkResponse({ type: PromptEntity })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.promptsService.remove(id);
  }
}
