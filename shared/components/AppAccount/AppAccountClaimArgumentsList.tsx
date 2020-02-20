import { Routes } from 'mobile/src/navigation/Routes';
import * as React from 'react';
import { FlatList, ListRenderItemInfo, StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { NavigationScreenProps, withNavigation } from 'react-navigation';
import AppAccountArgumentItem from 'shared/components/Argument/AppAccountArgumentItem';
import FeedClaimItem from 'shared/components/Claim/FeedClaimItem';
import { PaginatedListProps } from 'shared/styles/props';
import { Whitespace } from 'shared/styles/views';
import { Argument } from 'shared/types/argument';
import { AppAccountClaimWithArguments } from 'shared/types/claim';
import BaseLine from '../Base/BaseLine';

interface Props extends NavigationScreenProps, PaginatedListProps {
  claimAndArguments: AppAccountClaimWithArguments[];
  style?: StyleProp<ViewStyle>;
}

const AppAccountClaimArgumentsList = (props: Props) => {
  const { style, claimAndArguments, refetch, refreshing, onLoadMore, navigation } = props;

  const renderClaimAndArguments = (rowData: ListRenderItemInfo<AppAccountClaimWithArguments>) => {
    const argumentJsx: React.ReactNode[] = [];
    const onPressClaim = () => navigation.navigate({
      routeName: Routes.ClaimStack,
      params: { claimId: rowData.item.id },
      key: `${Routes.Claim}-${rowData.item.id}`,
    });

    rowData.item.arguments.map((argument: Argument) => {
      argumentJsx.push(
        <AppAccountArgumentItem
          key={ argument.id }
          argument={ argument }
          style={ { marginTop: Whitespace.SMALL } }
        />,
      );
    });

    return (
      <TouchableOpacity onPress={ onPressClaim } style={ { padding: Whitespace.SMALL } } delayPressIn={ 1000 }>
        <FeedClaimItem claim={ rowData.item }>
          { argumentJsx }
        </FeedClaimItem>
        <BaseLine style={ { marginTop: Whitespace.LARGE } } />
      </TouchableOpacity>
    );
  };

  const keyExtractor = (item: AppAccountClaimWithArguments, index: number) => index.toString();

  return (
    <View style={ [ styles.container, style ] }>
      <FlatList
        onRefresh={ refetch }
        refreshing={ refreshing }
        onEndReached={ onLoadMore }
        keyExtractor={ keyExtractor }
        data={ claimAndArguments }
        renderItem={ renderClaimAndArguments }
      />
    </View>
  );

};

const styles = StyleSheet.create({
  container: { },
});

export default withNavigation(AppAccountClaimArgumentsList);
