import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { PromptsService } from './prompts.service';
import { CreatePromptDto } from './dto/create-prompt.dto';
import { ApiTags, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { PromptEntity } from './entities/prompt.entity';

@ApiTags('prompts')
@Controller('prompts')
export class PromptsController {
  constructor(private readonly promptsService: PromptsService) {}

  @Post()
  @ApiCreatedResponse({ type: PromptEntity })
  create(@Body() createPromptDto: CreatePromptDto) {
    return this.promptsService.create(createPromptDto);
  }

  @Get()
  @ApiOkResponse({ type: [PromptEntity] })
  findAll() {
    return this.promptsService.findAll();
  }

  @Get('failures')
  @ApiOkResponse({ type: [PromptEntity] })
  findAllFailures() {
    return this.promptsService.findAllFailures();
  }

  @Get(':id')
  @ApiOkResponse({ type: PromptEntity })
  async findOne(@Param('id') id: string) {
    const prompt = await this.promptsService.findOne(+id);

    if (!prompt) {
      throw new NotFoundException(`Prompt #${id} not found`);
    }

    return prompt;
  }

  @Delete(':id')
  @ApiOkResponse({ type: PromptEntity })
  async remove(@Param('id') id: string) {
    const prompt = await this.promptsService.findOne(+id);

    if (!prompt) {
      throw new NotFoundException(`Prompt #${id} not found`);
    }

    return this.promptsService.remove(prompt.id);
  }
}
