import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import AppAccountArgumentItem from 'shared/components/Argument/AppAccountArgumentItem';
import BaseLine from 'shared/components/Base/BaseLine';
import { PaginatedListProps } from 'shared/styles/props';
import { isLargerThanTablet } from 'shared/styles/utils';
import { Whitespace } from 'shared/styles/views';
import { Argument } from 'shared/types/argument';
import { AppAccountClaimWithArguments } from 'shared/types/claim';
import FeedClaimItem from '../Claim/FeedClaimItem';

interface Props extends PaginatedListProps {
  claimAndArguments: AppAccountClaimWithArguments[];
  style?: React.CSSProperties;
}

const AppAccountClaimArgumentsList = (props: Props) => {
  const { claimAndArguments, style, onLoadMore, hasMore } = props;

  const listJsx: React.ReactNode[] = [];
  claimAndArguments.map((claim: AppAccountClaimWithArguments) => {
    const argumentJsx: React.ReactNode[] = [];

    claim.arguments.map((argument: Argument) => {
      argumentJsx.push(
        <React.Fragment>
          <BaseLine style={ { marginTop: Whitespace.SMALL, marginBottom: Whitespace.SMALL } } />
          <AppAccountArgumentItem
            key={ argument.id }
            argument={ argument }
            style={ { marginTop: Whitespace.TINY, marginBottom: Whitespace.SMALL } }
          />
        </React.Fragment>,
      );
    });

    listJsx.push(
      <div key={ claim.id } style={ { marginBottom: isLargerThanTablet() ? 64 : 48 } }>
        <FeedClaimItem claim={ claim } style={ styles.claimContainer }>
          { argumentJsx }
        </FeedClaimItem>
      </div>,
    );
  });

  return (
    <div style={ { ...styles.container, ...style } }>
      <InfiniteScroll
        loadMore={ onLoadMore }
        hasMore={ hasMore }
        threshold={ 400 }
      >
        { listJsx }
      </InfiniteScroll>
    </div>
  );

};

const styles = {
  container: { flexGrow: 1 },
  claimContainer: {
    display: 'flex' as 'flex',
  },
};

export default AppAccountClaimArgumentsList;
