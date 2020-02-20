import { ArgumentCommentDraftActionType } from 'shared/redux/actions';
import { ArgumentCommentDraftAction } from 'shared/redux/actions/argument-comment-draft.action';
import { ID } from 'shared/types';

export interface ArgumentCommentDraft {
  text?: string;
  claimId: ID;
  argumentId: ID;
  elementId: ID;
}

export interface StateArgumentCommentDrafts {
  argument_comment_drafts: ArgumentCommentDraft[];
}

type State = StateArgumentCommentDrafts;

const initialState = { argument_comment_drafts: [] };

const argument_comment_drafts = (state: State = initialState, action: ArgumentCommentDraftAction) => {
  switch (action.type) {
    case ArgumentCommentDraftActionType.ADD_DRAFT_ARGUMENT_COMMENT:
      const findCommentIndex = state.argument_comment_drafts.findIndex((draft: ArgumentCommentDraft) => {
        return draft.claimId === action.claimId && draft.argumentId === action.argumentId && draft.elementId === action.elementId;
      });
      if (findCommentIndex === -1) {
        state.argument_comment_drafts.push({
          text: action.text, claimId: action.claimId, argumentId: action.argumentId, elementId: action.elementId,
        });
      } else {
        state.argument_comment_drafts[findCommentIndex].text = action.text;
      }

      return { argument_comment_drafts: state.argument_comment_drafts };
    case ArgumentCommentDraftActionType.REMOVE_DRAFT_ARGUMENT_COMMENT:
      const findIndex = state.argument_comment_drafts.findIndex((draft: ArgumentCommentDraft) => {
        return draft.claimId === action.claimId && draft.argumentId === action.argumentId && draft.elementId === action.elementId;
      });
      if (findIndex !== -1 ) {
        state.argument_comment_drafts.splice(findIndex);
      }
      return { argument_comment_drafts: state.argument_comment_drafts };
    case ArgumentCommentDraftActionType.REMOVE_ALL_DRAFTS_ARGUMENT_COMMENT:
      state.argument_comment_drafts = [];
      return { argument_comment_drafts: state.argument_comment_drafts };
    default:
      return state;
  }
};

export default argument_comment_drafts;
