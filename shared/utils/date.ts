import { Elapsed, ElapsedIdentifier, Time } from 'shared/types/date';

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const DateUtil = {
  format: (timestamp: string) => {
    const date = new Date(timestamp.replace(/-/g, '/').replace('T', ' ').replace(/\..*|\+.*/, '') + ' UTC');
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    const thisYear = new Date().getFullYear();

    if (thisYear === year) {
      return `${month} ${day}`;
    }

    return `${month} ${day}, ${year}`;
  },

  addOffsetToTime: (date_future: Time, offset: number): Time => {
    const timestamp = new Date(date_future).getTime();
    const addedTime = timestamp + offset;

    return new Date(addedTime).toISOString();
  },

  elapsed: (date_future: Time): Elapsed => {
    const timestamp = (new Date(date_future)).getTime();
    const date_now = Date.now();

    // get total seconds between the times
    let pastFuture = timestamp - date_now < 0 ? ElapsedIdentifier.AGO : ElapsedIdentifier.LEFT;

    let delta = Math.abs(timestamp - date_now) / 1000;

    // calculate (and subtract) whole days
    const days = Math.floor(delta / 86400);
    delta -= days * 86400;
    const stringDays = days.toFixed();

    // calculate (and subtract) whole hours
    const hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;
    const stringHours = hours.toFixed();

    // calculate (and subtract) whole minutes
    const minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;
    const stringMinutes = minutes.toFixed();

    // what's left is seconds
    const seconds = Math.floor(delta % 60);  // in theory the modulus is not required
    const stringSeconds = seconds.toFixed();

    if (days > 0) {
      return {
        number: days,
        delimited: hours > 1 ? `${stringDays}d ${stringHours}h` : `${stringDays}d ${stringMinutes}m`,
        abbr: 'd' ,
        label: `day${hours !== 1 ? 's' : ''}` ,
        pastFuture };
    }

    if (hours > 0) {
      return {
        number: hours,
        delimited: minutes > 1 ? `${stringHours}h ${stringMinutes}m` : `${stringHours}h ${stringSeconds}s`,
        abbr: 'h' ,
        label: 'hours',
        pastFuture };
    }

    if (minutes > 0) {
      return {
        number: minutes,
        delimited: `${stringMinutes}m ${stringSeconds}s`,
        abbr: 'm',
        label: 'minutes',
        pastFuture,
      };
    }

    return {
      number: seconds,
      delimited: `${stringSeconds}s`,
      abbr: 's',
      label: `second${seconds !== 1 ? 's' : ''}`,
      pastFuture };
  },
};

export default DateUtil;
