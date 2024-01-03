import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BodyMetrics, BodyMetricsSchema } from './entities/body-metrics.entity';
import { BodyMetricsController } from './controllers/body-metrics.controller';
import { BodyMetricsService } from './services/body-metrics.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: BodyMetrics.name,
        schema: BodyMetricsSchema,
      },
    ]),
  ],
  controllers: [BodyMetricsController],
  providers: [BodyMetricsService],
})
export class BodyMetricsModule {}
