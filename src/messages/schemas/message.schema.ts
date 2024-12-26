import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema({
  timestamps: true, 
  collection: 'messages' 
})
export class Message {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true 
  })
  senderId: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true 
  })
  receiverId: MongooseSchema.Types.ObjectId;

  @Prop({
    required: true,
    type: String,
    minlength: 1,
    maxlength: 1000,
    trim: true
  })
  content: string;

  @Prop({
    type: Boolean,
    default: false,
    index: true 
  })
  read: boolean;

  @Prop({
    type: String,
    enum: ['text', 'image', 'file'],
    default: 'text'
  })
  messageType: string;

  @Prop({
    type: String,
    default: null
  })
  fileUrl?: string;

  @Prop({
    type: Boolean,
    default: false
  })
  deleted: boolean;

  @Prop({
    type: Date,
    default: null
  })
  readAt?: Date;
}

const MessageSchema = SchemaFactory.createForClass(Message);

MessageSchema.index({ senderId: 1, receiverId: 1, createdAt: -1 });

MessageSchema.methods.isDeletable = function(): boolean {
  const now = new Date();
  const messageDate = this.createdAt;
  const hoursSinceCreated = (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60);
  return hoursSinceCreated <= 24; 
};

export { MessageSchema };