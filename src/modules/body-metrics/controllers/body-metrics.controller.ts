import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
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
import { BodyMetricsDto } from '../dtos/body-metrics.dto';
import { UpdateMetricsRequestDto } from '../dtos/request/update-metrics.request.dto';

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

  @Get(':id')
  @UseGuards(AuthGuard)
  async getByUser(
    @Param('id') id: string,
  ): Promise<BodyMetricsDto[] | ErrorResponseDto> {
    return this.bodyMetricsService.find({ userId: id });
  }

  @Get('detail/:id')
  @UseGuards(AuthGuard)
  async getById(
    @Param('id') id: string,
  ): Promise<BodyMetricsDto | ErrorResponseDto> {
    return this.bodyMetricsService.findById(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateMetricsDto: UpdateMetricsRequestDto,
  ): Promise<BodyMetricsDto | ErrorResponseDto> {
    return this.bodyMetricsService.update(id, updateMetricsDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async delete(@Param('id') id: string): Promise<BodyMetricsDto> {
    return this.bodyMetricsService.remove(id);
  }
}
