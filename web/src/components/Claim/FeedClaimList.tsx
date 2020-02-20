import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import Fade from 'react-reveal/Fade';
import ArgumentSummaryText from 'shared/components/Argument/ArgumentSummaryText';
import TopArgumentHeader from 'shared/components/Argument/TopArgumentHeader';
import BaseLine from 'shared/components/Base/BaseLine';
import FeedClaimItem from 'shared/components/Claim/FeedClaimItem';
import BaseATag from 'shared/components/WebOnly/BaseATag';
import { PaginatedListProps } from 'shared/styles/props';
import { Whitespace } from 'shared/styles/views';
import { FeedClaim } from 'shared/types/claim';
import { Routes } from '../../navigation/Routes';

interface Props extends PaginatedListProps {
  claims: FeedClaim[];
  style?: React.CSSProperties;
}

const FeedClaimList = (props: Props) => {
  const { claims, style, onLoadMore, hasMore } = props;

  const listJsx: React.ReactNode[] = [];
  claims.map((claim: FeedClaim) => {

    const renderTopArgument = () => {
      if (!claim.topArgument) return null;

      return (
        <React.Fragment>
          <BaseLine style={ { marginTop: Whitespace.SMALL, marginBottom: Whitespace.SMALL } } />
          <div style={ { paddingLeft: Whitespace.CONTAINER, paddingRight: Whitespace.CONTAINER, flexDirection: 'column' } }>
            <TopArgumentHeader argument={ claim.topArgument } />
            <BaseATag
              appLink={ `${Routes.CLAIM}${claim.id}${Routes.ARGUMENT}${claim.topArgument.id}` }
            >
              <ArgumentSummaryText summary={ claim.topArgument.summary } />
            </BaseATag>
          </div>
        </React.Fragment>
      );
    };

    listJsx.push(
      <div key={ claim.id } style={ { marginBottom: 64 } }>
        <Fade bottom={ true } duration={ 500 }>
          <FeedClaimItem key={ claim.id } claim={ claim }>
            { renderTopArgument() }
          </FeedClaimItem>
        </Fade>
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
};

export default FeedClaimList;
