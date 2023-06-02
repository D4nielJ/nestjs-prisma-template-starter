import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreatePromptDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @ApiProperty()
  content: string;
}
