import React from 'react';
import LazyLoad from 'react-lazyload';
import { StyleSheet } from 'react-native';
import { RouteComponentProps, withRouter } from 'react-router';
import { FeedClaimImageProps } from 'shared/components/Claim/FeedClaimImage';
import { Whitespace } from 'shared/styles/views';
import { isVideo } from 'shared/utils/video';
import { Routes } from 'web/src/navigation/Routes';
import ClaimVideo from './ClaimVideo';

interface Props extends FeedClaimImageProps, RouteComponentProps { }

const FeedClaimImage = (props: Props) => {

  const { claim, style, history } = props;

  if (isVideo(claim))
    return <ClaimVideo claim={ claim } height={ 405 } width={ '100%' } />;

  const goToClaim = () => history.push(`${Routes.CLAIM}${claim.id}`);

  return (
    <LazyLoad>
      <img
        className={ 'feed-claim-image' }
        onClick={ goToClaim }
        src={ claim.image }
        style={ { ...styles.container, ...StyleSheet.flatten(style) } }
      />
    </LazyLoad>
  );
};

const styles = {
  container: {
    cursor: 'pointer',
    objectFit: 'cover' as 'cover',
    borderRadius: Whitespace.TINY,
    marginRight: Whitespace.MEDIUM,
  },
};

export default withRouter(FeedClaimImage);
