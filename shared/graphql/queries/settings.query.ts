import gql from 'graphql-tag';
import COIN_FRAGMENT from 'shared/graphql/fragments/coin.fragment';

const SETTINGS_QUERY = gql`
    query SettingsQuery {
      settings {
        minClaimLength
        maxClaimLength
        claimAdmins
        minSlashCount
        slashMagnitude
        slashMinStake {
          ...CoinFragment
        }
        slashAdmins
        curatorShare
        maxDetailedReasonLength
        period
        argumentCreationStake {
          ...CoinFragment
        }
        argumentBodyMinLength
        argumentBodyMaxLength
        argumentSummaryMinLength
        argumentSummaryMaxLength
        upvoteStake {
          ...CoinFragment
        }
        creatorShare
        interestRate
        stakingAdmins
        maxArgumentsPerClaim
        argumentCreationReward {
          ...CoinFragment
        }
		    upvoteCreatorReward {
          ...CoinFragment
        }
		    upvoteStakerReward {
          ...CoinFragment
        }
        maxSlashCount
        jailDuration
        minCommentLength
        maxCommentLength
        blockIntervalTime
        stakeDisplayDenom
      }
    }
    ${COIN_FRAGMENT}
`;

export default SETTINGS_QUERY;
