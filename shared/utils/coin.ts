import BigNumber from 'bignumber.js';
import { Coin, preethis } from 'shared/types/currency';

export const PREETHI = new BigNumber(1);
export const SHANEV = new BigNumber(1e6);

export const isBetween = (testNum: preethis, lowerBound: preethis, upperBound: preethis) => {
  if (isGreaterThan(testNum, lowerBound) && isLessThan(testNum, upperBound)) {
    return true;
  }
  return false;
};

export const isBetweenOrEqualTo = (testNum: preethis, lowerBound: preethis, upperBound: preethis) => {
  if (isGreaterThanOrEqualTo(testNum, lowerBound) && isLessThanOrEqualTo(testNum, upperBound)) {
    return true;
  }
  return false;
};

export const isLessThan = (firstNum: preethis, secondNum: preethis): boolean => {
  return new BigNumber(firstNum).isLessThan(new BigNumber(secondNum));
};

export const isGreaterThan = (firstNum: preethis, secondNum: preethis): boolean => {
  return new BigNumber(firstNum).isGreaterThan(new BigNumber(secondNum));
};

export const isLessThanOrEqualTo = (firstNum: preethis, secondNum: preethis): boolean => {
  return new BigNumber(firstNum).isLessThanOrEqualTo(new BigNumber(secondNum));
};

export const isGreaterThanOrEqualTo = (firstNum: preethis, secondNum: preethis): boolean => {
  return new BigNumber(firstNum).isGreaterThanOrEqualTo(new BigNumber(secondNum));
};

export const isZero = (amount: Coin): boolean => {
  return amount.amount === '0';
};

