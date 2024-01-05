import { OmitType, PartialType } from '@nestjs/mapped-types';
import { BodyMetricsDto } from '../body-metrics.dto';

export class UpdateMetricsRequestDto extends PartialType(
  OmitType(BodyMetricsDto, ['id', 'userId'] as const),
) {}
