import { ApiProperty } from '@nestjs/swagger';
import { Prompt, Status } from '@prisma/client';

export class PromptEntity implements Prompt {
  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  id: number;

  @ApiProperty({ required: true })
  content: string;

  @ApiProperty()
  status: Status;
}
