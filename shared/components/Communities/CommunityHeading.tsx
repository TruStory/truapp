import React from 'react';
import { QueryResult } from 'react-apollo';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import BaseLoadingIndicator from 'shared/components/Base/BaseLoadingIndicator';
import BaseText from 'shared/components/Base/BaseText';
import FollowCommunityButton, { FollowButtonType } from 'shared/components/Communities/FollowCommunityButton';
import FOLLOW_COMMUNITY_QUERY from 'shared/graphql/queries/follow-community.query';
import CommunityQuery, { CommunityData } from 'shared/graphql/types/CommunityQuery';
import { TextSize } from 'shared/styles';
import { Whitespace } from 'shared/styles/views';

interface Props {
  style?: StyleProp<ViewStyle>;
  communityId: string;
}

const CommunityHeading = (props: Props) => {
  const {  communityId, style } = props;

  const renderScreen = (result: QueryResult<CommunityData, any>) => {

    const { loading, error, data } = result;

    if (loading) return <BaseLoadingIndicator />;
    if (error || !data || !data.community) return null;
    const { community } = data;

    return (
      <View style={ [ styles.container, style ] }>
        <BaseText
          style={ { paddingRight: Whitespace.CONTAINER, paddingLeft: Whitespace.CONTAINER } }
          textSize={ TextSize.H2 }
          bold={ true }
        >
          { community.name }
        </BaseText>
        <FollowCommunityButton
          communityId={ community.id }
          following={ !!community.following }
          type={ FollowButtonType.BUTTON }
        />
    </View>
    );
  };

  return (
    <CommunityQuery query={ FOLLOW_COMMUNITY_QUERY } variables={ { communityId } }>
      { renderScreen }
    </CommunityQuery>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', alignItems: 'center', display:  'flex', justifyContent: 'space-between', flexWrap: 'wrap' ,  marginVertical: Whitespace.MEDIUM,
  },
});

export default CommunityHeading;
