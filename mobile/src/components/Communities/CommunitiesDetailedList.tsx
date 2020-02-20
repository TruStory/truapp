import React from 'react';
import { QueryResult } from 'react-apollo';
import { FlatList, Image, ListRenderItemInfo, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { connect } from 'react-redux';
import { Account } from 'shared/blockchain/account';
import BaseLoadingIndicator from 'shared/components/Base/BaseLoadingIndicator';
import BaseText from 'shared/components/Base/BaseText';
import FollowCommunityButton, { FollowButtonType } from 'shared/components/Communities/FollowCommunityButton';
import FOLLOW_COMMUNITIES_QUERY from 'shared/graphql/queries/follow-communities.query';
import FollowCommunitiesQuery, { CommunitiesData } from 'shared/graphql/types/FollowCommunitiesQuery';
import { Color } from 'shared/styles/colors';
import { Whitespace } from 'shared/styles/views';
import { Community } from 'shared/types/community';

interface Props {
  account?: Account;
  showDescription?: boolean;
  style?: StyleProp<ViewStyle>;
}

const CommunitiesDetailedList = (props: Props) => {

  const renderList = (result: QueryResult<CommunitiesData, any>) => {
    const { account, style, showDescription } = props;

    if (!account)
      return null;

    const { loading, error, data } = result;

    if (loading) return <BaseLoadingIndicator />;
    if (error || !data || !data.communities) return null;
    const { communities } = data;

    const renderComment = (rowData: ListRenderItemInfo<Community>) => {
      const community = rowData.item;

      // tslint:disable: jsx-no-multiline-js
      return (
        <View style={ [ styles.container, style ] }>
          <View style={ styles.header }>
            <BaseText
              bold={ true }
              color={ community.following ? Color.APP_PURPLE : Color.APP_BLACK }
            >
              { community.name }
            </BaseText>
            <FollowCommunityButton communityId={ community.id } following={ !!community.following } type={ FollowButtonType.TEXT } />
          </View>
          <Image source={ { uri: community.heroImage } } style={ styles.image } />
          { showDescription &&
            <BaseText
              style={ { paddingRight: 2, paddingLeft: 2, display: 'flex' } }
            >
              { community.description }
            </BaseText> }
        </View>
      );
    };

    const keyExtractor = (item: Community, index: number) => index.toString();

    return (
      <View style={ [ styles.container, style ] }>
        <FlatList
          keyExtractor={ keyExtractor }
          data={ communities }
          renderItem={ renderComment }
          keyboardDismissMode={ 'interactive' }
          contentContainerStyle={ styles.container }
        />
      </View>
    );

  };

  return (
    <FollowCommunitiesQuery query={ FOLLOW_COMMUNITIES_QUERY }>
      { renderList }
    </FollowCommunitiesQuery>
  );
};

CommunitiesDetailedList.defaultProps = {
  showDescription: true,
};

const styles = StyleSheet.create({
  container: { marginBottom: Whitespace.MEDIUM },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Whitespace.MEDIUM,
    marginBottom: Whitespace.CONTAINER,
  },
  image: {
    width: '100%',
    height: 150,
  },
});

const mapStateToProps = (state: any) => ({
  account: state.auth.account,
});

export default connect(mapStateToProps)(CommunitiesDetailedList);
