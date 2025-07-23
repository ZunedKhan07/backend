import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Post extends Document {
  @Prop({ required: true }) title: string;
  @Prop() description: string;
  @Prop({ type: Types.ObjectId, ref: 'User' }) author: Types.ObjectId;
  @Prop({ default: Date.now }) createdAt: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);
