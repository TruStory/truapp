import { CommentDraftActionType } from 'shared/redux/actions';
import { ID } from 'shared/types';

export interface AddCommentDraft {
  type: CommentDraftActionType.ADD_DRAFT;
  text: string;
  claimId: ID;
}

export interface RemoveCommentDraft {
  type: CommentDraftActionType.REMOVE_DRAFT;
  claimId: ID;
}

export interface RemoveAllCommentDrafts {
  type: CommentDraftActionType.REMOVE_ALL_DRAFTS;
}

export function addCommentDraft(claimId: ID, text: string): AddCommentDraft {
  return {
    type: CommentDraftActionType.ADD_DRAFT,
    text,
    claimId,
  };
}

export function removeCommentDraft(claimId: ID): RemoveCommentDraft {
  return {
    type: CommentDraftActionType.REMOVE_DRAFT,
    claimId,
  };
}

export function removeAllCommentDrafts(): RemoveAllCommentDrafts {
  return {
    type: CommentDraftActionType.REMOVE_ALL_DRAFTS,
  };
}

export type CommentDraftAction = AddCommentDraft | RemoveCommentDraft | RemoveAllCommentDrafts;
