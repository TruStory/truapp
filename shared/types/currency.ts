export type preethis = string;

export interface Coin {
  amount: preethis;
  denom: string;
  humanReadable: string;
}

export enum Coins {
  TRU = 'trusteak',
  ATOM = 'atom',
}
