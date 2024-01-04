import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BodyMetrics } from '../entities/body-metrics.entity';
import { AbstractCrudService } from 'src/services/abstract-crud.service';

@Injectable()
export class BodyMetricsService extends AbstractCrudService<BodyMetrics> {
  constructor(
    @InjectModel(BodyMetrics.name) private bodyMetricsModel: Model<BodyMetrics>,
  ) {
    super(bodyMetricsModel);
  }
}
