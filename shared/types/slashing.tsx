
export enum SlashArgumentReason {
  LogicAbsent,
  IssueNotAddressed,
  FocusedOnPerson,
  NoOriginalThought,
  Plagiarism,
  Other,
  Harassment,
  Spam,
  OffensiveContent,
}

export interface SlashArgumentReasonOption {
  id: SlashArgumentReason;
  name: string;
}

export enum SlashType {
  SlashTypeUnhelpful,
}
