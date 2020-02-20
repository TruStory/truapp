import { SlashArgumentReason, SlashArgumentReasonOption } from 'shared/types/slashing';

export const slashArgumentReasonMatchMap = new Map<SlashArgumentReason, string>([
  [SlashArgumentReason.LogicAbsent, 'No clear logic or evidence'],
  [SlashArgumentReason.IssueNotAddressed, `Doesn't address the issue`],
  [SlashArgumentReason.FocusedOnPerson, 'Focuses on the person'],
  [SlashArgumentReason.NoOriginalThought, 'No original thought'],
  [SlashArgumentReason.Plagiarism, 'Plagiarism'],
  [SlashArgumentReason.Other, 'Other'],
  [SlashArgumentReason.Harassment, 'Harassment'],
  [SlashArgumentReason.Spam, 'Spam'],
  [SlashArgumentReason.OffensiveContent, 'Offensive content'],
]);

export const slashArgumentReasons: SlashArgumentReasonOption[] = [
  { id: SlashArgumentReason.LogicAbsent, name: slashArgumentReasonMatchMap.get(SlashArgumentReason.LogicAbsent)! },
  { id: SlashArgumentReason.IssueNotAddressed, name: slashArgumentReasonMatchMap.get(SlashArgumentReason.IssueNotAddressed)! },
  { id: SlashArgumentReason.FocusedOnPerson, name: slashArgumentReasonMatchMap.get(SlashArgumentReason.FocusedOnPerson)! },
  { id: SlashArgumentReason.NoOriginalThought, name: slashArgumentReasonMatchMap.get(SlashArgumentReason.NoOriginalThought)! },
  { id: SlashArgumentReason.Plagiarism, name: slashArgumentReasonMatchMap.get(SlashArgumentReason.Plagiarism)! },
  { id: SlashArgumentReason.Other, name: slashArgumentReasonMatchMap.get(SlashArgumentReason.Other)! },
  { id: SlashArgumentReason.Harassment, name: slashArgumentReasonMatchMap.get(SlashArgumentReason.Harassment)! },
  { id: SlashArgumentReason.Spam, name: slashArgumentReasonMatchMap.get(SlashArgumentReason.Spam)! },
  { id: SlashArgumentReason.OffensiveContent, name: slashArgumentReasonMatchMap.get(SlashArgumentReason.OffensiveContent)! },
];
