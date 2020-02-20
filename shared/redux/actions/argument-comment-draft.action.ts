import { ArgumentCommentDraftActionType } from 'shared/redux/actions';
import { ID } from 'shared/types';

export interface AddArgumentCommentDraft {
  type: ArgumentCommentDraftActionType.ADD_DRAFT_ARGUMENT_COMMENT;
  text: string;
  claimId: ID;
  argumentId: ID;
  elementId: ID;
}

export interface RemoveArgumentCommentDraft {
  type: ArgumentCommentDraftActionType.REMOVE_DRAFT_ARGUMENT_COMMENT;
  claimId: ID;
  argumentId: ID;
  elementId: ID;
}

export interface RemoveAllArgumentCommentDrafts {
  type: ArgumentCommentDraftActionType.REMOVE_ALL_DRAFTS_ARGUMENT_COMMENT;
}

export function addArgumentCommentDraft(claimId: ID, argumentId: ID, elementId: ID, text: string): AddArgumentCommentDraft {
  return {
    type: ArgumentCommentDraftActionType.ADD_DRAFT_ARGUMENT_COMMENT,
    text,
    claimId,
    argumentId,
    elementId,
  };
}

export function removeArgumentCommentDraft(claimId: ID, argumentId: ID, elementId: ID): RemoveArgumentCommentDraft {
  return {
    type: ArgumentCommentDraftActionType.REMOVE_DRAFT_ARGUMENT_COMMENT,
    claimId,
    argumentId,
    elementId,
  };
}

export function removeAllArgumentCommentDrafts(): RemoveAllArgumentCommentDrafts {
  return {
    type: ArgumentCommentDraftActionType.REMOVE_ALL_DRAFTS_ARGUMENT_COMMENT,
  };
}

export type ArgumentCommentDraftAction = AddArgumentCommentDraft | RemoveArgumentCommentDraft | RemoveAllArgumentCommentDrafts;
