import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class BodyMetrics extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  weight: number;

  @Prop({ required: true })
  armsCircumference: number[];

  @Prop({ required: true })
  forearmsCircumference: number[];

  @Prop({ required: true })
  wristsCircumference: number[];

  @Prop({ required: true })
  legsUpCircumference: number[];

  @Prop({ required: true })
  calfsCircumference: number[];

  @Prop({ required: true })
  waistCircumference: number;

  @Prop({ required: true })
  hipCircumference: number;

  @Prop({ required: true })
  bodyFatPercentage: number;

  @Prop({ required: true })
  muscleMass: number;

  @Prop({ required: true })
  bmi: number;

  @Prop()
  createdAt: Date;
}

export const BodyMetricsSchema = SchemaFactory.createForClass(BodyMetrics).set(
  'timestamps',
  true,
);
