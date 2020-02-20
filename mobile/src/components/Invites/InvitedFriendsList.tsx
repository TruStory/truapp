import { Routes } from 'mobile/src/navigation/Routes';
import React from 'react';
import { QueryResult } from 'react-apollo';
import { FlatList, ListRenderItemInfo, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { NavigationScreenProps, withNavigation } from 'react-navigation';
import BaseActionable from 'shared/components/Base/BaseActionable';
import BaseLine from 'shared/components/Base/BaseLine';
import BaseLoadingIndicator from 'shared/components/Base/BaseLoadingIndicator';
import BaseText from 'shared/components/Base/BaseText';
import ErrorComponent from 'shared/components/ErrorComponent';
import REFERRED_USERS_QUERY from 'shared/graphql/queries/referred-users.query';
import ReferredUsersQuery, { ReferredUsersData } from 'shared/graphql/types/ReferredUsers';
import { Color } from 'shared/styles/colors';
import { Whitespace } from 'shared/styles/views';
import { AppAccount } from 'shared/types/appAccount';

interface Props extends NavigationScreenProps{
  style?: StyleProp<ViewStyle> & React.CSSProperties;
}

const InvitedFriendsList = (props: Props) => {
  const { style, navigation } = props;

  const renderList = (result: QueryResult<ReferredUsersData, any>) => {
    const { loading, error, data, refetch } = result;
    if (loading) return <BaseLoadingIndicator />;
    if (error || !data) return <ErrorComponent onRefresh={ refetch } />;

    const { referredAppAccounts } = data;
    const renderUser = (rowData: ListRenderItemInfo<AppAccount>) => {
      return(
        <BaseActionable onAction={ () => navigation.navigate(Routes.InviteDetails, { appAccount: rowData.item }) }>
          <BaseText>{ `@${rowData.item.userProfile.username}` }</BaseText>
          <BaseLine style={ { marginVertical: Whitespace.MEDIUM } } />
        </BaseActionable>
      );
    };

    if (referredAppAccounts.length === 0) {
      return (
        <BaseText
          style={ { paddingTop: Whitespace.SMALL } }
          bold={ true }
          color={ Color.GRAY }
        >
          No Invites Sent
        </BaseText>
      );
    }

    const keyExtractor = (item: AppAccount, index: number) => index.toString();

    return (
      <View style={ style }>
        <FlatList
          keyExtractor={ keyExtractor }
          data={ referredAppAccounts }
          renderItem={ renderUser }
          contentContainerStyle={ styles.container }
        />
      </View>
    );
  };

  return (
    <ReferredUsersQuery query={ REFERRED_USERS_QUERY }>
      { renderList }
    </ReferredUsersQuery>
  );

};

const styles = StyleSheet.create({
  container: { flexGrow: 1 },
});

export default withNavigation(InvitedFriendsList);
