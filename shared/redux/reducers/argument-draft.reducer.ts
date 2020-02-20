import { DraftActionType } from 'shared/redux/actions';
import { DraftAction } from 'shared/redux/actions/argument-draft.action';
import { ID } from 'shared/types';

export interface ArgumentDraft {
  argumentText?: string;
  summaryText?: string;
  vote?: boolean;
  claimId: ID;
}

export interface StateArgumentDrafts {
  drafts: ArgumentDraft[];
}

type State = StateArgumentDrafts;

const initialState = { drafts: [] };

const drafts = (state: State = initialState, action: DraftAction) => {
  switch (action.type) {
    case DraftActionType.ADD_DRAFT_ARGUMENT:
      const findArgumentIndex = state.drafts.findIndex((draft: ArgumentDraft) => draft.claimId === action.claimId);
      if (findArgumentIndex === -1) state.drafts.push({ argumentText: action.argumentText, claimId: action.claimId });
      else {
        state.drafts[findArgumentIndex].argumentText = action.argumentText;
      }

      return { drafts: state.drafts };
    case DraftActionType.ADD_DRAFT_SUMMARY:
      const findSummaryIndex = state.drafts.findIndex((draft: ArgumentDraft) => draft.claimId === action.claimId);
      if (findSummaryIndex === -1) state.drafts.push({ summaryText: action.summaryText, claimId: action.claimId });
      else {
        state.drafts[findSummaryIndex].summaryText = action.summaryText;
      }

      return { drafts: state.drafts };
    case DraftActionType.ADD_DRAFT_VOTE:
      const findVoteIndex = state.drafts.findIndex((draft: ArgumentDraft) => draft.claimId === action.claimId);
      if (findVoteIndex === -1) state.drafts.push({ vote: action.vote, claimId: action.claimId });
      else {
        state.drafts[findVoteIndex].vote = action.vote;
      }

      return { drafts: state.drafts };
    case DraftActionType.REMOVE_DRAFT:
      const findIndex = state.drafts.findIndex((draft: ArgumentDraft) => draft.claimId === action.claimId );
      if (findIndex !== -1 ) {
        state.drafts.splice(findIndex);
      }
      return { drafts: state.drafts };
    case DraftActionType.REMOVE_ALL_DRAFTS:
      state.drafts = [];
      return { drafts: state.drafts };
    default:
      return state;
  }
};

export default drafts;
