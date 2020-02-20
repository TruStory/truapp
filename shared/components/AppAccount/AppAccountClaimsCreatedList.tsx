import { Routes } from 'mobile/src/navigation/Routes';
import * as React from 'react';
import { FlatList, ListRenderItemInfo, StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { NavigationScreenProps, withNavigation } from 'react-navigation';
import FeedClaimItem from 'shared/components/Claim/FeedClaimItem';
import { PaginatedListProps } from 'shared/styles/props';
import { Whitespace } from 'shared/styles/views';
import { AppAccountClaim } from 'shared/types/claim';

interface Props extends NavigationScreenProps, PaginatedListProps {
  claims: AppAccountClaim[];
  style?: StyleProp<ViewStyle>;

}

const AppAccountClaimsCreatedList = (props: Props) => {
  const { style, claims, refetch, refreshing, onLoadMore, navigation } = props;

  const renderClaims= (rowData: ListRenderItemInfo<AppAccountClaim>) => {
    const onPressClaim = () => navigation.navigate({
      routeName: Routes.ClaimStack,
      params: { claimId: rowData.item.id },
      key: `${Routes.Claim}-${rowData.item.id}`,
    });

    return (
      <TouchableOpacity onPress={ onPressClaim } delayPressIn={ 1000 }>
        <FeedClaimItem
          claim={ rowData.item }
          style={ styles.claimContainer }
        />
      </TouchableOpacity>
    );
  };

  const keyExtractor = (item: AppAccountClaim, index: number) => index.toString();

  return (
    <View style={ [ styles.container, style ] }>
      <FlatList
        onRefresh={ refetch }
        refreshing={ refreshing }
        onEndReached={ onLoadMore }
        keyExtractor={ keyExtractor }
        data={ claims }
        renderItem={ renderClaims }
      />
    </View>
  );

};

const styles = StyleSheet.create({
  container: { },
  claimContainer: {
    padding: Whitespace.SMALL,
  },
});

export default withNavigation(AppAccountClaimsCreatedList);
