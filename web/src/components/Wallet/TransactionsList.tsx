import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import BaseLine from 'shared/components/Base/BaseLine';
import TransactionItem from 'shared/components/Wallet/TransactionItem';
import { PaginatedListProps } from 'shared/styles/props';
import { Whitespace } from 'shared/styles/views';
import { Transaction } from 'shared/types/transactions';

interface Props extends PaginatedListProps {
  transactions: Transaction[];
  style?: React.CSSProperties;
}

const TransactionsList = (props: Props) => {
  const { transactions, style, onLoadMore, hasMore } = props;

  const listJsx: React.ReactNode[] = [];
  transactions.map((transaction: Transaction) => {
    listJsx.push(
      <div key={ transaction.id } style={ { marginBottom: Whitespace.LARGE } }>
        <TransactionItem key={ transaction.id } transaction={ transaction } />
        <BaseLine style={ { marginTop: 24, marginBottom: 24 } } />
      </div>,
    );
  });

  return (
    <div style={ { ...styles.container, ...style } }>
      <InfiniteScroll
        loadMore={ onLoadMore }
        hasMore={ hasMore }
        threshold={ 100 }
      >
        { listJsx }
      </InfiniteScroll>
    </div>
  );

};

const styles = {
  container: { flexGrow: 1 },
};

export default TransactionsList;
