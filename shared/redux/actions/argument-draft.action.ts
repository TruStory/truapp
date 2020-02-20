import { DraftActionType } from 'shared/redux/actions';
import { ID } from 'shared/types';

export interface AddDraftArgument {
  type: DraftActionType.ADD_DRAFT_ARGUMENT;
  argumentText: string;
  claimId: ID;
}

export interface AddDraftSummary {
  type: DraftActionType.ADD_DRAFT_SUMMARY;
  summaryText: string;
  claimId: ID;
}

export interface AddDraftVote {
  type: DraftActionType.ADD_DRAFT_VOTE;
  vote: boolean;
  claimId: ID;
}

export interface RemoveDraft {
  type: DraftActionType.REMOVE_DRAFT;
  claimId: ID;
}

export interface RemoveAllDrafts {
  type: DraftActionType.REMOVE_ALL_DRAFTS;
}

export function addDraftArgument(claimId: ID, argumentText: string): AddDraftArgument {
  return {
    type: DraftActionType.ADD_DRAFT_ARGUMENT,
    argumentText,
    claimId,
  };
}

export function addDraftSummary(claimId: ID, summaryText: string): AddDraftSummary {
  return {
    type: DraftActionType.ADD_DRAFT_SUMMARY,
    summaryText,
    claimId,
  };
}

export function addDraftVote(claimId: ID, vote: boolean): AddDraftVote {
  return {
    type: DraftActionType.ADD_DRAFT_VOTE,
    vote,
    claimId,
  };
}

export function removeDraft(claimId: ID): RemoveDraft {
  return {
    type: DraftActionType.REMOVE_DRAFT,
    claimId,
  };
}

export function removeAllDrafts(): RemoveAllDrafts {
  return {
    type: DraftActionType.REMOVE_ALL_DRAFTS,
  };
}

export type DraftAction = AddDraftArgument | AddDraftSummary | AddDraftVote | RemoveDraft | RemoveAllDrafts;
