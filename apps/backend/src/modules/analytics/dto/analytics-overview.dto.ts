import { Exclude, Expose, plainToInstance, Type } from 'class-transformer';
import { JobStatus } from '../../../../generated/prisma/client';
import type { AnalyticsOverview, TrendDirection } from '../types/analytics.types';

@Exclude()
export class MetricSummaryDto {
  @Expose()
  value!: number;

  @Expose()
  changePercent!: number;

  @Expose()
  trendDirection!: TrendDirection;
}

@Exclude()
export class AnalyticsSummaryDto {
  @Expose()
  @Type(() => MetricSummaryDto)
  applications!: MetricSummaryDto;

  @Expose()
  @Type(() => MetricSummaryDto)
  interviews!: MetricSummaryDto;

  @Expose()
  @Type(() => MetricSummaryDto)
  offers!: MetricSummaryDto;

  @Expose()
  @Type(() => MetricSummaryDto)
  acceptanceRate!: MetricSummaryDto;
}

@Exclude()
export class TimeSeriesPointDto {
  @Expose()
  label!: string;

  @Expose()
  applications!: number;

  @Expose()
  interviews!: number;
}

@Exclude()
export class StatusDistributionSegmentDto {
  @Expose()
  status!: JobStatus;

  @Expose()
  count!: number;

  @Expose()
  percentage!: number;
}

@Exclude()
export class StatusDistributionDto {
  @Expose()
  total!: number;

  @Expose()
  @Type(() => StatusDistributionSegmentDto)
  segments!: StatusDistributionSegmentDto[];
}

@Exclude()
export class FunnelStageDto {
  @Expose()
  stage!: JobStatus;

  @Expose()
  count!: number;

  @Expose()
  percentage!: number;
}

@Exclude()
export class AnalyticsInsightDto {
  @Expose()
  id!: string;

  @Expose()
  text!: string;
}

@Exclude()
export class AnalyticsOverviewResponseDto {
  @Expose()
  rangeStart!: string;

  @Expose()
  rangeEnd!: string;

  @Expose()
  @Type(() => AnalyticsSummaryDto)
  summary!: AnalyticsSummaryDto;

  @Expose()
  @Type(() => TimeSeriesPointDto)
  applicationsOverTime!: TimeSeriesPointDto[];

  @Expose()
  @Type(() => StatusDistributionDto)
  statusDistribution!: StatusDistributionDto;

  @Expose()
  @Type(() => FunnelStageDto)
  conversionFunnel!: FunnelStageDto[];

  @Expose()
  @Type(() => AnalyticsInsightDto)
  insights!: AnalyticsInsightDto[];

  static fromDomain(overview: AnalyticsOverview): AnalyticsOverviewResponseDto {
    return plainToInstance(AnalyticsOverviewResponseDto, overview);
  }
}
