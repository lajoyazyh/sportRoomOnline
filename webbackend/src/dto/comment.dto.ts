import { Rule, RuleType } from '@midwayjs/validate';

export class CreateCommentDTO {
  @Rule(RuleType.number().required())
  activityId: number;

  @Rule(RuleType.string().required().min(1).max(1000))
  content: string;

  @Rule(RuleType.number().required().min(1).max(5))
  rating: number;

  @Rule(RuleType.array().items(RuleType.string()).optional())
  images?: string[];
}

export class UpdateCommentDTO {
  @Rule(RuleType.string().required().min(1).max(1000))
  content: string;

  @Rule(RuleType.number().required().min(1).max(5))
  rating: number;

  @Rule(RuleType.array().items(RuleType.string()).optional())
  images?: string[];
}
