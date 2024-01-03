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

@Controller('metrics')
@UseInterceptors(ClassSerializerInterceptor)
@UsePipes(new ValidationPipe())
export class BodyMetricsController {
  constructor(private readonly bodyMetricsService: BodyMetricsService) {}

  @Post()
  @UseGuards(AuthGuard)
  createByUser(@Request() req, @Body() createMetricsDto: any) {
    console.log(req);
    return this.bodyMetricsService.createByUser(createMetricsDto);
  }
}
