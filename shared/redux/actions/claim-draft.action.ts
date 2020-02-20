import { ClaimDraftActionType } from 'shared/redux/actions';
import { ID } from 'shared/types';

export interface AddClaimDraftClaim {
  type: ClaimDraftActionType.ADD_DRAFT_CLAIM;
  claimText: string;
  tempId: ID;
}

export interface AddClaimDraftCommunity {
  type: ClaimDraftActionType.ADD_DRAFT_COMMUNITY;
  communityId: string;
  tempId: ID;
}

export interface AddClaimDraftSource {
  type: ClaimDraftActionType.ADD_DRAFT_SOURCE;
  sourceText: string;
  tempId: ID;
}

export interface AddClaimDraftArgument {
  type: ClaimDraftActionType.ADD_DRAFT_ARGUMENT;
  argumentText: string;
  tempId: ID;
}

export interface AddClaimDraftSummary {
  type: ClaimDraftActionType.ADD_DRAFT_SUMMARY;
  summaryText: string;
  tempId: ID;
}

export interface AddClaimDraftVote {
  type: ClaimDraftActionType.ADD_DRAFT_VOTE;
  vote: boolean;
  tempId: ID;
}

export interface RemoveClaimDraft {
  type: ClaimDraftActionType.REMOVE_DRAFT;
  tempId: ID;
}

export interface RemoveAllClaimDrafts {
  type: ClaimDraftActionType.REMOVE_ALL_DRAFTS;
}

export function addClaimDraftClaim(tempId: ID, claimText: string): AddClaimDraftClaim {
  return {
    type: ClaimDraftActionType.ADD_DRAFT_CLAIM,
    claimText,
    tempId,
  };
}

export function addClaimDraftCommunity(tempId: ID, communityId: string): AddClaimDraftCommunity {
  return {
    type: ClaimDraftActionType.ADD_DRAFT_COMMUNITY,
    communityId,
    tempId,
  };
}

export function addClaimDraftSource(tempId: ID, sourceText: string): AddClaimDraftSource {
  return {
    type: ClaimDraftActionType.ADD_DRAFT_SOURCE,
    sourceText,
    tempId,
  };
}

export function addClaimDraftArgument(tempId: ID, argumentText: string): AddClaimDraftArgument {
  return {
    type: ClaimDraftActionType.ADD_DRAFT_ARGUMENT,
    argumentText,
    tempId,
  };
}

export function addClaimDraftSummary(tempId: ID, summaryText: string): AddClaimDraftSummary {
  return {
    type: ClaimDraftActionType.ADD_DRAFT_SUMMARY,
    summaryText,
    tempId,
  };
}

export function addClaimDraftVote(tempId: ID, vote: boolean): AddClaimDraftVote {
  return {
    type: ClaimDraftActionType.ADD_DRAFT_VOTE,
    vote,
    tempId,
  };
}

export function removeClaimDraft(tempId: ID): RemoveClaimDraft {
  return {
    type: ClaimDraftActionType.REMOVE_DRAFT,
    tempId,
  };
}

export function removeAllClaimDrafts(): RemoveAllClaimDrafts {
  return {
    type: ClaimDraftActionType.REMOVE_ALL_DRAFTS,
  };
}

export type ClaimDraftAction = AddClaimDraftClaim | AddClaimDraftCommunity | AddClaimDraftSource
| AddClaimDraftArgument | AddClaimDraftSummary | AddClaimDraftVote | RemoveClaimDraft | RemoveAllClaimDrafts;
