import React from 'react';
import { QueryResult } from 'react-apollo';
import { StyleProp, StyleSheet, View } from 'react-native';
import TopArgumentItem from 'shared/components/Argument/TopArgumentItem';
import BaseLoadingIndicator from 'shared/components/Base/BaseLoadingIndicator';
import BaseText from 'shared/components/Base/BaseText';
import ClaimIndicators from 'shared/components/Claim/ClaimIndicators';
import ClaimSource from 'shared/components/Claim/ClaimSource';
import FeedClaimImage from 'shared/components/Claim/FeedClaimImage';
import FeedClaimText from 'shared/components/Claim/FeedClaimText';
import CommunityHeroImage from 'shared/components/Communities/CommunityHeroImage';
import CLAIM_OF_THE_DAY_QUERY from 'shared/graphql/queries/claim-of-the-day.query';
import ClaimOfTheDayQuery, { ClaimOfTheDayQueryData } from 'shared/graphql/types/ClaimOfTheDayQuery';
import { TextSize } from 'shared/styles';
import { isWeb } from 'shared/styles/utils';
import { Whitespace } from 'shared/styles/views';
import { ID } from 'shared/types';
import { isVideo } from 'shared/utils/video';
import BaseActionable from '../Base/BaseActionable';

interface Props {
  communityId: string;
  onOpenClaim: (claimId: ID) => void;
  style?: StyleProp<any> & React.CSSProperties;
}

const ClaimOfTheDay = (props: Props) => {
  const { communityId, style, onOpenClaim } = props;

  const renderScreen = (result: QueryResult<ClaimOfTheDayQueryData, any>) => {
    const { loading, error, data } = result;

    if (loading ) return <BaseLoadingIndicator />;
    if (error || ! data || !data.claimOfTheDay) return <CommunityHeroImage communityId={ communityId } />;
    const { claimOfTheDay } = data;

    const jsx = (
    <View style={ [ styles.container, style ] }>
      <BaseText
        textSize={ TextSize.H2 }
        bold={ true }
        style={ { marginBottom: Whitespace.LARGE, paddingRight: Whitespace.CONTAINER, paddingLeft: Whitespace.CONTAINER, marginTop: Whitespace.TINY } }
      >
        { communityId === 'home' ? 'For You' : 'Debate Of The Day' }
      </BaseText>
      <div
        style={ { flexWrap: 'wrap', flexDirection: isVideo(claimOfTheDay) ? 'column' : 'row', display: 'flex' } }
        className={ 'daily-debate-container' }
      >
        <FeedClaimImage claim={ claimOfTheDay } style={ styles.image } />
        <View style={ styles.textContainer }>
          <FeedClaimText claim={ claimOfTheDay } style={ { marginTop: isVideo(claimOfTheDay) ? 4 : -3 } } />
          <ClaimSource claim={ claimOfTheDay } style={ { marginTop: 4 } } />
          <ClaimIndicators claim={ claimOfTheDay } style={ { marginTop: 3 } } />
        </View>
      </div>
      <TopArgumentItem claim={ claimOfTheDay } style={ { marginTop: Whitespace.MEDIUM } } />
    </View>
    );

    if (isWeb()) return jsx;

    const onOpenClaimAction = () => onOpenClaim(claimOfTheDay.id);
    return(
      <BaseActionable onAction={ onOpenClaimAction }>
        { jsx }
      </BaseActionable>
    );
  };

  return (
    <ClaimOfTheDayQuery query={ CLAIM_OF_THE_DAY_QUERY } variables={ { communityId } }>
      { renderScreen }
    </ClaimOfTheDayQuery>
  );

};

const styles = StyleSheet.create({
  container: { flexDirection: 'column' },
  textContainer: {
    flexDirection: 'column',
    flex: 1,
    paddingTop: 4,
  },
  image: {
    width: '43.75%',
    maxHeight: 180,
  },
});

export default ClaimOfTheDay;
