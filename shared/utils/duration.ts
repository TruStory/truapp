export const SECOND = 1000000000; // ns in second
export const MINUTE = SECOND * 60;
export const HOUR = MINUTE * 60;
export const DAY = HOUR * 24;
export const NANOSECONDS_PER_DAY = 8.64e+13;
export const NANOSECONDS_PER_HOUR = 3.6e+12;

export const nanosecondsToHours = (duration: number): number => {
  return duration / NANOSECONDS_PER_HOUR;
};

export const daysToNanoseconds = (duration: number): number => {
  return duration * NANOSECONDS_PER_DAY;
};

export const nanosecondsToDays = (duration: number): number => {
  return duration / NANOSECONDS_PER_DAY;
};
