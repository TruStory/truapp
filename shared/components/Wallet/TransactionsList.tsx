import * as React from 'react';
import { FlatList, ListRenderItemInfo, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import BaseLine from 'shared/components/Base/BaseLine';
import { PaginatedListProps } from 'shared/styles/props';
import { Whitespace } from 'shared/styles/views';
import { Transaction } from 'shared/types/transactions';
import TransactionItem from './TransactionItem';

interface Props extends PaginatedListProps {
  transactions: Transaction[];
  style?: StyleProp<ViewStyle>;
}

const TransactionsList = (props: Props) => {
  const { transactions, style, refetch, refreshing, onLoadMore } = props;

  const renderTransactions = (rowData: ListRenderItemInfo<Transaction>) => {
    return (
      <View style={ { paddingLeft: Whitespace.SMALL, paddingRight: Whitespace.SMALL, marginTop: Whitespace.MEDIUM } }>
        <TransactionItem  transaction={ rowData.item } />
        <BaseLine style={ { marginTop: Whitespace.MEDIUM } } />
      </View>
    );
  };

  const keyExtractor = (item: Transaction, index: number) => index.toString();

  return (
    <View style={ [ styles.container, style ] }>
      <FlatList
        onRefresh={ refetch }
        refreshing={ refreshing }
        onEndReached={ onLoadMore }
        keyExtractor={ keyExtractor }
        data={ transactions }
        renderItem={ renderTransactions }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { },
  claimContainer: {
    flexDirection: 'column',
  },
});

export default TransactionsList;
