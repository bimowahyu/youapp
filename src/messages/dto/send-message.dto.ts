import { IsString, IsNotEmpty, IsMongoId, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendMessageDto {
  @ApiProperty({
    example: '507f1f77bcf86cd799439012',
    description: 'MongoDB ID of the message sender',
  })
  @IsMongoId()
  @IsNotEmpty({ message: 'Sender ID is required' })
  senderId: string;

  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'MongoDB ID of the message recipient',
  })
  @IsMongoId()
  @IsNotEmpty({ message: 'Recipient ID is required' })
  recipientId: string;

  @ApiProperty({
    example: 'Hello, how are you?',
    description: 'Content of the message',
  })
  @IsString()
  @IsNotEmpty({ message: 'Message content cannot be empty' })
  @MinLength(1, { message: 'Message content must not be empty' })
  @MaxLength(1000, { message: 'Message content cannot exceed 1000 characters' })
  content: string;
}
