import React from 'react';
import { QueryResult } from 'react-apollo';
import { Image, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import FadeIn from 'react-native-fade-in-image';
import CommunityHeading from 'shared/components/Communities/CommunityHeading';
import COMMUNITY_HERO_IMAGE_QUERY from 'shared/graphql/queries/community-hero-image.query';
import CommunityHeroImageQuery, { CommunityHeroImageData } from 'shared/graphql/types/CommunityHeroImageQuery';
import { Whitespace } from 'shared/styles/views';

interface Props {
  communityId: string;
  style?: StyleProp<ViewStyle> & React.CSSProperties;
}

const CommunityHeroImage = (props: Props) => {
  const { style, communityId } = props;

  const renderScreen = (result: QueryResult<CommunityHeroImageData, any>) => {

    const { loading, error, data } = result;

    if (loading || error || !data || !data.community) return null;
    const { community } = data;

    return(
      <View style={ [ styles.container, style ] }>
        <CommunityHeading
          communityId={ communityId }
          style={ { marginRight: Whitespace.SMALL } }
        />
        <FadeIn>
          <Image source={ { uri: community.heroImage } } style={ styles.image } />
        </FadeIn>
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
  image: {
    width: '100%',
    height: 150,
  },
});

export default CommunityHeroImage;
