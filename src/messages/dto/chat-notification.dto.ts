import { ApiProperty } from '@nestjs/swagger';

export class ChatNotificationDto {
  @ApiProperty()
  messageId: string;

  @ApiProperty()
  senderId: string;

  @ApiProperty()
  receiverId: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  createdAt: Date;
}