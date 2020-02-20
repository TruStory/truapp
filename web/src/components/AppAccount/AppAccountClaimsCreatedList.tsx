import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { PaginatedListProps } from 'shared/styles/props';
import { isLargerThanTablet } from 'shared/styles/utils';
import { AppAccountClaim } from 'shared/types/claim';
import FeedClaimItem from '../Claim/FeedClaimItem';

interface Props extends PaginatedListProps {
  claims: AppAccountClaim[];
  style?: React.CSSProperties;
}

const AppAccountClaimsCreatedList = (props: Props) => {
  const { claims, style, onLoadMore, hasMore } = props;

  const listJsx: React.ReactNode[] = [];
  claims.map((claim: AppAccountClaim) => {

    listJsx.push(
      <div key={ claim.id } style={ { marginBottom: isLargerThanTablet() ? 64 : 48 } }>
        <FeedClaimItem claim={ claim } style={ styles.claimContainer } />
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

export default AppAccountClaimsCreatedList;
