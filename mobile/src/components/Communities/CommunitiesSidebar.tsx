import MenuLink from 'mobile/src/components/Menu/MenuLink';
import { Routes } from 'mobile/src/navigation/Routes';
import React from 'react';
import { QueryResult } from 'react-apollo';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import BaseLoadingIndicator from 'shared/components/Base/BaseLoadingIndicator';
import ErrorComponent from 'shared/components/ErrorComponent';
import COMMUNITIES_QUERY from 'shared/graphql/queries/communities.query';
import CommunitiesQuery, { CommunitiesQueryData } from 'shared/graphql/types/CommunitiesQuery';
import { Community } from 'shared/types/community';

interface Props {
  onClick?: () => void;
  style?: StyleProp<ViewStyle>;
}

const CommunitiesSidebar = (props: Props) => {

  const { style, onClick } = props;
  const renderCommunities = (result: QueryResult<CommunitiesQueryData, any>) => {
    const { loading, error, data, refetch } = result;
    if (loading) return <BaseLoadingIndicator />;
    if (error || !data || !data.communities) return <ErrorComponent onRefresh={ refetch } />;

    const communities: Community[] = data.communities;
    const listJsx: React.ReactNode[] = [];
    communities.map((community: Community) => {

      listJsx.push(
        <MenuLink
          key={ community.id }
          path={ Routes.Feed }
          routeParams={ { communityId: community.id } }
          title={ community.name }
          onClick={ onClick }
          icon={ { active: { uri: community.iconImage.active }, regular: { uri: community.iconImage.regular } } }
        />,
        );
    });

    return (
      <View style={ [ styles.container, style ] }>
        { listJsx }
      </View>
    );
  };

  return (
    <CommunitiesQuery query={ COMMUNITIES_QUERY }>
      { renderCommunities }
    </CommunitiesQuery>
  );
};

const styles = StyleSheet.create({
  container: {  },
});

export default CommunitiesSidebar;
