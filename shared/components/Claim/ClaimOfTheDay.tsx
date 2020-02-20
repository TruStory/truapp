import React from 'react';
import { QueryResult } from 'react-apollo';
import { StyleProp, StyleSheet, View } from 'react-native';
import TopArgumentItem from 'shared/components/Argument/TopArgumentItem';
import BaseLoadingIndicator from 'shared/components/Base/BaseLoadingIndicator';
import BaseText from 'shared/components/Base/BaseText';
import ClaimSource from 'shared/components/Claim/ClaimSource';
import FeedClaimImage from 'shared/components/Claim/FeedClaimImage';
import FeedClaimText from 'shared/components/Claim/FeedClaimText';
import CommunityHeroImage from 'shared/components/Communities/CommunityHeroImage';
import CLAIM_OF_THE_DAY_QUERY from 'shared/graphql/queries/claim-of-the-day.query';
import ClaimOfTheDayQuery, { ClaimOfTheDayQueryData } from 'shared/graphql/types/ClaimOfTheDayQuery';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { isWeb } from 'shared/styles/utils';
import { Whitespace } from 'shared/styles/views';
import { ID } from 'shared/types';
import BaseActionable from '../Base/BaseActionable';
import ClaimIndicators from './ClaimIndicators';

interface Props {
  communityId: string;
  cacheBuster: number;
  onOpenClaim: (claimId: ID) => void;
  style?: StyleProp<any> & React.CSSProperties;
}

const ClaimOfTheDay = (props: Props) => {
  const { communityId, style, onOpenClaim, cacheBuster } = props;

  const renderScreen = (result: QueryResult<ClaimOfTheDayQueryData, any>) => {
    const { loading, error, data } = result;

    if (loading ) return <BaseLoadingIndicator />;
    if (error || ! data || !data.claimOfTheDay) return <CommunityHeroImage communityId={ communityId } style={ { marginBottom: Whitespace.LARGE } } />;
    const { claimOfTheDay } = data;

    const jsx = (
      <View style={ [ styles.container, style ] }>
        <BaseText
          textSize={ TextSize.H1 }
          bold={ true }
          style={ { marginBottom: Whitespace.MEDIUM, paddingHorizontal: 10, marginTop: Whitespace.TINY } }
        >
          { communityId === 'home' ? 'For You' : 'Featured Debate' }
        </BaseText>
        <FeedClaimImage claim={ claimOfTheDay } style={ styles.image } />
        <View style={ styles.textContainer }>
          <BaseText textSize={ TextSize.H5 } color={ Color.APP_PURPLE } style={ { marginBottom: Whitespace.TINY } }>Claim</BaseText>
          <FeedClaimText claim={ claimOfTheDay } textSize={ TextSize.H2 } />
          <ClaimSource claim={ claimOfTheDay } style={ { marginTop: Whitespace.CONTAINER } } />
          <ClaimIndicators claim={ claimOfTheDay } style={ { marginTop: 3 } } />
        </View>
        <TopArgumentItem claim={ claimOfTheDay } style={ { marginTop: Whitespace.SMALL } } />
      </View>
    );

    if (isWeb()) return jsx;

    const onOpenClaimAction = () => onOpenClaim(claimOfTheDay.id);
    return(
      <BaseActionable onAction={ onOpenClaimAction } delayPressIn={ 1000 }>
        { jsx }
      </BaseActionable>
    );
  };

  return (
    <ClaimOfTheDayQuery query={ CLAIM_OF_THE_DAY_QUERY } variables={ { communityId, cacheBuster } } fetchPolicy={ 'network-only' }>
      { renderScreen }
    </ClaimOfTheDayQuery>
  );

};

const styles = StyleSheet.create({
  container: { flexDirection: 'column', flex: 1 },
  textContainer: {
    flexDirection: 'column',
    flex: 1,
    paddingTop: Whitespace.SMALL,
    paddingHorizontal: isWeb() ? 0 : Whitespace.SMALL,
  },
  image: {
    width: '100%',
    height: 226,
    flex: 1,
  },
});

export default ClaimOfTheDay;
