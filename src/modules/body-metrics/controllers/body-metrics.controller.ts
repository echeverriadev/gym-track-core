import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BodyMetricsService } from '../services/body-metrics.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateMetricsRequestDto } from '../dtos/request/create-metrics.request.dto';
import { BodyMetricsCalculator } from '../utils/calculeta-body-metrics';
import { ErrorResponseDto } from 'src/dtos/error.response.dto';

@Controller('metrics')
@UseInterceptors(ClassSerializerInterceptor)
@UsePipes(new ValidationPipe({ transform: false }))
export class BodyMetricsController {
  constructor(private readonly bodyMetricsService: BodyMetricsService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createByUser(
    @Request() req,
    @Body() createMetricsDto: CreateMetricsRequestDto,
  ): Promise<any | ErrorResponseDto> {
    const bmi = BodyMetricsCalculator.calculateBMI(
      createMetricsDto.weight,
      req.user.height,
    );
    const bodyFatPercentage = BodyMetricsCalculator.calculateBodyFatPercentage(
      req.user.gender,
      createMetricsDto.weight,
      createMetricsDto.waistCircumference,
      createMetricsDto.wristsCircumference[0],
      createMetricsDto.hipCircumference,
      createMetricsDto.forearmsCircumference[0],
    );

    const muscleMass = BodyMetricsCalculator.calculateLeanBodyMass(
      createMetricsDto.weight,
      bodyFatPercentage,
    );

    createMetricsDto.userId = req.user.id;
    createMetricsDto.bmi = bmi;
    createMetricsDto.bodyFatPercentage = bodyFatPercentage;
    createMetricsDto.muscleMass = muscleMass;

    return this.bodyMetricsService.create(createMetricsDto);
  }
}
