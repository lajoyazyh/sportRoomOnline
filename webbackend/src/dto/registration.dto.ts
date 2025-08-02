import { Rule, RuleType } from '@midwayjs/validate';
import { RegistrationStatus } from '../entity/registration.entity';

export class CreateRegistrationDTO {
  @Rule(RuleType.number().integer().required())
  activityId: number;

  @Rule(RuleType.string().optional().allow('').max(500))
  message?: string;
}

export class UpdateRegistrationDTO {
  @Rule(
    RuleType.string()
      .optional()
      .valid(...Object.values(RegistrationStatus))
  )
  status?: RegistrationStatus;

  @Rule(RuleType.string().optional().allow('').max(500))
  rejectReason?: string;
}

export class RegistrationQueryDTO {
  @Rule(RuleType.number().integer().optional())
  activityId?: number;

  @Rule(RuleType.number().integer().optional())
  userId?: number;

  @Rule(
    RuleType.string()
      .optional()
      .valid(...Object.values(RegistrationStatus))
  )
  status?: RegistrationStatus;

  @Rule(RuleType.number().integer().min(1).default(1))
  page?: number;

  @Rule(RuleType.number().integer().min(1).max(100).default(10))
  pageSize?: number;
}

export class ReviewRegistrationDTO {
  @Rule(
    RuleType.string()
      .required()
      .valid(RegistrationStatus.APPROVED, RegistrationStatus.REJECTED)
  )
  status: RegistrationStatus;

  @Rule(RuleType.string().optional().allow('').max(500))
  rejectReason?: string;
}
