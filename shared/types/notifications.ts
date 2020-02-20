import { ID } from 'shared/types';
import { Creator } from 'shared/types/appAccount';
import { Time } from 'shared/types/date';

export interface NotificationMeta {
  claimId?: ID;
  argumentId?: ID;
  elementId?: ID;
  commentId?: ID;
  mentionType?: MentionType;
  storyId?: ID;
}

export interface NotificationData {
  id: ID;
  image?: string;
  senderProfile?: Creator;
  body: string;
  typeId: number;
  title: string;
  userId?: string;
  read: boolean;
  type: NotificationType;
  createdTime: Time;
  meta: NotificationMeta;
}

export enum NotificationType {
  ClaimAction,
  ArgumentAction,
  CommentAction,
  MentionAction,
  NewArgument,
  AgreeReceived,
  NotHelpful,
  EarnedStake,
  Slashed,
  Jailed,
  Unjailed,
  ArgumentCommentAction,
  RewardInviteUnlocked,
  RewardTruUnlocked,
  FeaturedDebate,
  StakeLimitIncreased,
}

export enum MentionType {
  ArgumentMention,
  CommentMention,
  ArgumentCommentMention,
}

export interface NotificationsCount {
  count: number;
}
