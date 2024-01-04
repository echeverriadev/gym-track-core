import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  Max,
} from 'class-validator';
import { IsArrayOfSize } from 'src/decorators/custom-class-validator';

export class CreateMetricsRequestDto {
  @IsOptional()
  @IsMongoId()
  userId?: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  weight: number;

  @IsNotEmpty()
  @IsArrayOfSize(2)
  @IsNumber({}, { each: true })
  @IsPositive({ each: true })
  armsCircumference: number[];

  @IsNotEmpty()
  @IsArrayOfSize(2)
  @IsNumber({}, { each: true })
  @IsPositive({ each: true })
  forearmsCircumference: number[];

  @IsNotEmpty()
  @IsArrayOfSize(2)
  @IsNumber({}, { each: true })
  @IsPositive({ each: true })
  wristsCircumference: number[];

  @IsNotEmpty()
  @IsArrayOfSize(2)
  @IsNumber({}, { each: true })
  @IsPositive({ each: true })
  legsUpCircumference: number[];

  @IsNotEmpty()
  @IsArrayOfSize(2)
  @IsNumber({}, { each: true })
  @IsPositive({ each: true })
  calfsCircumference: number[];

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  waistCircumference: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  hipCircumference: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Max(50)
  bmi?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  muscleMass?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Max(100)
  bodyFatPercentage?: number;
}
