import { UserJourney } from 'shared/types/journey';

export const journeyMatchMap = new Map<UserJourney, string>([
  [UserJourney.SIGNED_UP, 'Successfully signed up on TruStory'],
  [UserJourney.WROTE_ARGUMENT, 'Have written their first argument'],
  [UserJourney.EARNED_AGREES, 'Have received at least five agrees'],
]);
