import { Coins } from 'shared/types/currency';
import { EarningsData } from 'shared/types/wallet';

export const mockEarningsData: EarningsData = {
  netEarnings: {
    amount: '1800000000000',
    denom: Coins.TRU,
    humanReadable: '1800',
  },
  dataPoints: [
    { date: 'Mon May 29 21:15:47 UTC 2019', amount: 300 },
    { date: 'Tue Jun 11 21:15:47 UTC 2019', amount: 100 },
    { date: 'Tue Jun 18 21:15:47 UTC 2019', amount: 800 },
    { date: 'Tue Jun 25 21:15:47 UTC 2019', amount: 600 },
  ],
};
