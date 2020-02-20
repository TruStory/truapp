import { best_black, best_purple, newest_black, newest_purple, trending_black, trending_purple } from 'shared/images/Filters/FilterImages';
import { Argument, ArgumentSort, ArgumentSorts } from 'shared/types/argument';

export const sortArguments = (allArgument: Argument[]): Argument[] => {
  let challengeArgs: Argument[] = [];
  let backingArgs: Argument[] = [];
  let allArgs: Argument[] = [];
  let notHelpfulArgs: Argument[] = [];

  allArgument.map((argument: Argument) => {
    if (argument.vote) backingArgs.push(argument);
    else challengeArgs.push(argument);
  });

  const sort = (a: Argument, b: Argument) => {
    if (b.stakers.length > a.stakers.length) return 1;
    if (b.stakers.length < a.stakers.length) return -1;
    return new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime();
  };

  challengeArgs.sort((a, b) => sort(a, b));
  backingArgs.sort((a, b) => sort(a, b));

  const firstArray = challengeArgs[0] && backingArgs[0]
    && challengeArgs[0].stakers.length > backingArgs[0].stakers.length ? challengeArgs : backingArgs;
  const secondArray = firstArray === challengeArgs ? backingArgs : challengeArgs;

  for ( let i = 0; i < Math.max(challengeArgs.length, backingArgs.length); i++ ) {
    if (firstArray[i]) {
      if (firstArray[i].isUnhelpful) {
        notHelpfulArgs.push(firstArray[i]);
      } else {
        allArgs.push(firstArray[i]);
      }
    }
    if (secondArray[i]) {
      if (secondArray[i].isUnhelpful) {
        notHelpfulArgs.push(secondArray[i]);
      } else {
        allArgs.push(secondArray[i]);
      }
    }
  }

  return allArgs.concat(notHelpfulArgs);
};

export const argumentSortNameMatchMap = new Map<ArgumentSorts, string>([
  [ArgumentSorts.TRENDING, 'Trending'],
  [ArgumentSorts.LATEST, 'Latest'],
  [ArgumentSorts.BEST, 'Best'],
]);

export const argumentSortActiveImageMap = new Map<ArgumentSorts, any>([
  [ArgumentSorts.TRENDING, trending_purple],
  [ArgumentSorts.LATEST, newest_purple],
  [ArgumentSorts.BEST, best_purple],
]);

export const argumentSortInactiveImageMap = new Map<ArgumentSorts, any>([
  [ArgumentSorts.TRENDING, trending_black],
  [ArgumentSorts.LATEST, newest_black],
  [ArgumentSorts.BEST, best_black],
]);

export const argumentSorts: ArgumentSort[] = [
  { id: ArgumentSorts.TRENDING, name: argumentSortNameMatchMap.get(ArgumentSorts.TRENDING)! },
  { id: ArgumentSorts.LATEST, name: argumentSortNameMatchMap.get(ArgumentSorts.LATEST)! },
  { id: ArgumentSorts.BEST, name: argumentSortNameMatchMap.get(ArgumentSorts.BEST)! },
];
