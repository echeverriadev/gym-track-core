import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { GENDERS } from '../utils/constants';

type Gender = (typeof GENDERS)[number];

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({
    required: true,
    unique: true,
    index: true,
    lowercase: true,
    trim: true,
  })
  email: string;

  @Prop({ required: true })
  birthDay: Date;

  @Prop({ required: true })
  height: number;

  @Prop({ required: true, enum: GENDERS })
  gender: Gender;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, default: true })
  status: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User).set(
  'timestamps',
  true,
);
