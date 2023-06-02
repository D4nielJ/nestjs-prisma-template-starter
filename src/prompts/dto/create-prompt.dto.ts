import { ApiProperty } from '@nestjs/swagger';

export class CreatePromptDto {
  @ApiProperty()
  content: string;
}
