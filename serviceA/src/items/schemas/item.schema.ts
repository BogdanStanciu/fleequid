import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { now, Document } from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class Item extends Document {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  @Prop({ required: true, unique: true })
  name: string;

  @ApiProperty()
  @Prop({ required: true })
  price: number;

  @ApiProperty({ required: false })
  @Prop({ required: false })
  description?: string;

  @ApiProperty()
  @Prop({ default: now(), select: false })
  updatedAt: Date;

  @ApiProperty()
  @Prop({ default: now(), select: false })
  createdAt: Date;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
