export type Time = string;

export enum ElapsedIdentifier {
  AGO='ago',
  LEFT='left',
}

export interface Elapsed {
  number: number;
  delimited: string;
  abbr: string;
  label: string;
  pastFuture: ElapsedIdentifier;
}
