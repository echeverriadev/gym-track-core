import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BodyMetrics } from '../entities/body-metrics.entity';

@Injectable()
export class BodyMetricsService {
  constructor(
    @InjectModel(BodyMetrics.name) private bodyMetricsModel: Model<BodyMetrics>,
  ) {}

  async createByUser(bodyMetrics: any) {
    // const bodyMetricsCreated = await this.bodyMetricsModel.create({
    //   ...bodyMetrics,
    //   user: id,
    // });
    return 'bodyMetricsCreated';
  }
}
