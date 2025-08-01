import { Rule, RuleType } from '@midwayjs/validate';
import { ActivityType, ActivityStatus } from '../entity/activity.entity';

export class CreateActivityDTO {
  @Rule(RuleType.string().required().max(100))
  title: string;

  @Rule(RuleType.string().required())
  description: string;

  @Rule(
    RuleType.string()
      .required()
      .valid(...Object.values(ActivityType))
  )
  type: ActivityType;

  @Rule(RuleType.string().required().max(100))
  location: string;

  @Rule(RuleType.date().required())
  startTime: Date;

  @Rule(RuleType.date().required())
  endTime: Date;

  @Rule(RuleType.date().required())
  registrationDeadline: Date;

  @Rule(RuleType.number().integer().min(1).default(1))
  minParticipants: number;

  @Rule(RuleType.number().integer().min(1).default(50))
  maxParticipants: number;

  @Rule(RuleType.number().min(0).default(0))
  fee: number;

  @Rule(RuleType.string().optional().allow(''))
  requirements?: string;

  @Rule(RuleType.string().optional().allow(''))
  equipment?: string;

  @Rule(RuleType.string().optional().allow('').max(100))
  contactInfo?: string;

  @Rule(RuleType.string().optional().allow(''))
  images?: string;
}

export class UpdateActivityDTO {
  @Rule(RuleType.string().optional().max(100))
  title?: string;

  @Rule(RuleType.string().optional())
  description?: string;

  @Rule(
    RuleType.string()
      .optional()
      .valid(...Object.values(ActivityType))
  )
  type?: ActivityType;

  @Rule(
    RuleType.string()
      .optional()
      .valid(...Object.values(ActivityStatus))
  )
  status?: ActivityStatus;

  @Rule(RuleType.string().optional().max(100))
  location?: string;

  @Rule(RuleType.date().optional())
  startTime?: Date;

  @Rule(RuleType.date().optional())
  endTime?: Date;

  @Rule(RuleType.date().optional())
  registrationDeadline?: Date;

  @Rule(RuleType.number().integer().min(1).optional())
  minParticipants?: number;

  @Rule(RuleType.number().integer().min(1).optional())
  maxParticipants?: number;

  @Rule(RuleType.number().min(0).optional())
  fee?: number;

  @Rule(RuleType.string().optional().allow(''))
  requirements?: string;

  @Rule(RuleType.string().optional().allow(''))
  equipment?: string;

  @Rule(RuleType.string().optional().allow('').max(100))
  contactInfo?: string;

  @Rule(RuleType.string().optional().allow(''))
  images?: string;
}

export class ActivityQueryDTO {
  @Rule(RuleType.string().optional())
  search?: string;

  @Rule(
    RuleType.string()
      .optional()
      .valid(...Object.values(ActivityType))
  )
  type?: ActivityType;

  @Rule(
    RuleType.string()
      .optional()
      .allow('')
      .valid('', ...Object.values(ActivityStatus))
  )
  status?: ActivityStatus | '';

  @Rule(RuleType.number().integer().min(1).default(1))
  page?: number;

  @Rule(RuleType.number().integer().min(1).max(100).default(10))
  pageSize?: number;

  @Rule(
    RuleType.string()
      .optional()
      .valid('startTime', 'createdAt', 'viewCount', 'likeCount')
  )
  sortBy?: string;

  @Rule(RuleType.string().optional().valid('ASC', 'DESC').default('DESC'))
  sortOrder?: 'ASC' | 'DESC';
}
