import { CommentDraftActionType } from 'shared/redux/actions';
import { CommentDraftAction } from 'shared/redux/actions/comment-draft.action';
import { ID } from 'shared/types';

export interface CommentDraft {
  text?: string;
  claimId: ID;
}

export interface StateCommentDrafts {
  comment_drafts: CommentDraft[];
}

type State = StateCommentDrafts;

const initialState = { comment_drafts: [] };

const comment_drafts = (state: State = initialState, action: CommentDraftAction) => {
  switch (action.type) {
    case CommentDraftActionType.ADD_DRAFT:
      const findCommentIndex = state.comment_drafts.findIndex((draft: CommentDraft) => draft.claimId === action.claimId);
      if (findCommentIndex === -1) state.comment_drafts.push({ text: action.text, claimId: action.claimId });
      else {
        state.comment_drafts[findCommentIndex].text = action.text;
      }

      return { comment_drafts: state.comment_drafts };
    case CommentDraftActionType.REMOVE_DRAFT:
      const findIndex = state.comment_drafts.findIndex((draft: CommentDraft) => draft.claimId === action.claimId );
      if (findIndex !== -1 ) {
        state.comment_drafts.splice(findIndex);
      }
      return { comment_drafts: state.comment_drafts };
    case CommentDraftActionType.REMOVE_ALL_DRAFTS:
      state.comment_drafts = [];
      return { comment_drafts: state.comment_drafts };
    default:
      return state;
  }
};

export default comment_drafts;
