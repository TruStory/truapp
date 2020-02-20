import React from 'react';
import { QueryResult } from 'react-apollo';
import LazyLoad from 'react-lazyload';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import BaseLoadingIndicator from 'shared/components/Base/BaseLoadingIndicator';
import COMMUNITY_HERO_IMAGE_QUERY from 'shared/graphql/queries/community-hero-image.query';
import CommunityHeroImageQuery, { CommunityHeroImageData } from 'shared/graphql/types/CommunityHeroImageQuery';

interface Props {
  communityId: string;
  style?: StyleProp<ViewStyle> & React.CSSProperties;
}

const CommunityHeroImage = (props: Props) => {
  const { style, communityId } = props;

  const renderScreen = (result: QueryResult<CommunityHeroImageData, any>) => {

    const { loading, error, data } = result;

    if (loading) return <BaseLoadingIndicator />;
    if (error || !data || !data.community) return null;
    const { community } = data;

    return(
      <View style={ [ styles.container, style ] }>
        <LazyLoad>
          <img src={ community.heroImage } className={ 'community-hero-image' } />
        </LazyLoad>
      </View>
    );
  };

  return (
    <CommunityHeroImageQuery query={ COMMUNITY_HERO_IMAGE_QUERY } variables={ { communityId } }>
      { renderScreen }
    </CommunityHeroImageQuery>
  );

};

const styles = StyleSheet.create({
  container: { flexDirection: 'column' },
});

export default CommunityHeroImage;
