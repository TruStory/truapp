import { ID } from 'shared/types';
import { Creator } from 'shared/types/appAccount';
import { Argument } from 'shared/types/argument';
import { Time } from 'shared/types/date';
import { SlashArgumentReason, SlashType } from 'shared/types/slashing';

export interface Slash {
  id: ID;
  argumentId: ID;
  type: SlashType;
  reason: SlashArgumentReason;
  detailedReason: string;
  creator: Creator;
  createdTime: Time;
}

export interface SlashWithArgument extends Slash {
  argument: Argument;
}
