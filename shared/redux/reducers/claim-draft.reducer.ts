import { ClaimDraftActionType } from 'shared/redux/actions';
import { ClaimDraftAction } from 'shared/redux/actions/claim-draft.action';
import { ID } from 'shared/types';

export interface ClaimDraft {
  tempId: ID;
  claimText?: string;
  communityId?: string;
  sourceText?: string;
  argumentText?: string;
  summaryText?: string;
  vote?: boolean;
}

export interface StateClaimDrafts {
  claim_drafts: ClaimDraft[];
}

type State = StateClaimDrafts;

const initialState = { claim_drafts: [] };

const claim_drafts = (state: State = initialState, action: ClaimDraftAction) => {
  switch (action.type) {
    case ClaimDraftActionType.ADD_DRAFT_CLAIM:
      const findClaimIndex = state.claim_drafts.findIndex((draft: ClaimDraft) => draft.tempId === action.tempId);
      if (findClaimIndex === -1) state.claim_drafts.push({ claimText: action.claimText, tempId: action.tempId });
      else {
        state.claim_drafts[findClaimIndex].claimText = action.claimText;
      }

      return { claim_drafts: state.claim_drafts };
    case ClaimDraftActionType.ADD_DRAFT_COMMUNITY:
      const findCommunityIndex = state.claim_drafts.findIndex((draft: ClaimDraft) => draft.tempId === action.tempId);
      if (findCommunityIndex === -1) state.claim_drafts.push({ communityId: action.communityId, tempId: action.tempId });
      else {
        state.claim_drafts[findCommunityIndex].communityId = action.communityId;
      }

      return { claim_drafts: state.claim_drafts };

    case ClaimDraftActionType.ADD_DRAFT_SOURCE:
      const findSourceIndex = state.claim_drafts.findIndex((draft: ClaimDraft) => draft.tempId === action.tempId);
      if (findSourceIndex === -1) state.claim_drafts.push({ sourceText: action.sourceText, tempId: action.tempId });
      else {
        state.claim_drafts[findSourceIndex].sourceText = action.sourceText;
      }

      return { claim_drafts: state.claim_drafts };

    case ClaimDraftActionType.ADD_DRAFT_ARGUMENT:
      const findArgumentIndex = state.claim_drafts.findIndex((draft: ClaimDraft) => draft.tempId === action.tempId);
      if (findArgumentIndex === -1) state.claim_drafts.push({ argumentText: action.argumentText, tempId: action.tempId });
      else {
        state.claim_drafts[findArgumentIndex].argumentText = action.argumentText;
      }

      return { claim_drafts: state.claim_drafts };
    case ClaimDraftActionType.ADD_DRAFT_SUMMARY:
      const findSummaryIndex = state.claim_drafts.findIndex((draft: ClaimDraft) => draft.tempId === action.tempId);
      if (findSummaryIndex === -1) state.claim_drafts.push({ summaryText: action.summaryText, tempId: action.tempId });
      else {
        state.claim_drafts[findSummaryIndex].summaryText = action.summaryText;
      }

      return { claim_drafts: state.claim_drafts };
    case ClaimDraftActionType.ADD_DRAFT_VOTE:
      const findVoteIndex = state.claim_drafts.findIndex((draft: ClaimDraft) => draft.tempId === action.tempId);
      if (findVoteIndex === -1) state.claim_drafts.push({ vote: action.vote, tempId: action.tempId });
      else {
        state.claim_drafts[findVoteIndex].vote = action.vote;
      }

      return { claim_drafts: state.claim_drafts };
    case ClaimDraftActionType.REMOVE_DRAFT:
      const findIndex = state.claim_drafts.findIndex((draft: ClaimDraft) => draft.tempId === action.tempId );
      if (findIndex !== -1 ) {
        state.claim_drafts.splice(findIndex);
      }
      return { claim_drafts: state.claim_drafts };
    case ClaimDraftActionType.REMOVE_ALL_DRAFTS:
      state.claim_drafts = [];
      return { claim_drafts: state.claim_drafts };
    default:
      return state;
  }
};

export default claim_drafts;
