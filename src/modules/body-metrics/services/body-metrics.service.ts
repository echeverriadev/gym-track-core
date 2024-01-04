import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BodyMetrics } from '../entities/body-metrics.entity';
import { AbstractCrudService } from 'src/services/abstract-crud.service';
import { BodyMetricsDto } from '../dtos/body-metrics.dto';

@Injectable()
export class BodyMetricsService extends AbstractCrudService<BodyMetrics> {
  constructor(
    @InjectModel(BodyMetrics.name) private bodyMetricsModel: Model<BodyMetrics>,
  ) {
    super(bodyMetricsModel);
  }

  protected mapEntityToDto(record: BodyMetrics) {
    const dto = new BodyMetricsDto();
    dto.id = record.id;
    dto.userId = record.userId;
    dto.weight = record.weight;
    dto.bmi = record.bmi;
    dto.bodyFatPercentage = record.bodyFatPercentage;
    dto.muscleMass = record.muscleMass;
    dto.armsCircumference = record.armsCircumference;
    dto.forearmsCircumference = record.forearmsCircumference;
    dto.wristsCircumference = record.wristsCircumference;
    dto.legsUpCircumference = record.legsUpCircumference;
    dto.calfsCircumference = record.calfsCircumference;
    dto.waistCircumference = record.waistCircumference;
    dto.hipCircumference = record.hipCircumference;
    return dto;
  }
}
