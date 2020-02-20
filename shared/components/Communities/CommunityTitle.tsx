import * as React from 'react';
import { Image, ImageURISource, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import BaseText from 'shared/components/Base/BaseText';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { Whitespace } from 'shared/styles/views';
import { Community } from 'shared/types/community';

export enum CommunityTitleType {
  ACTIVE = 'active',
  NORMAL = 'normal',
}

export enum CommunityTitleSize {
  SMALL='H6',
  REGULAR='H5',
  LARGE='H3',
  XLARGE='H1',
}

interface Props {
  community: Community;
  type?: CommunityTitleType;
  bold?: boolean;
  size?: CommunityTitleSize;
  style?: StyleProp<ViewStyle> & React.CSSProperties;
}

const CommunityTitle: React.FunctionComponent<Props> = (props: Props) => {
  const { community, type, bold, size, style } = props;

  let textJsx, imageSize;
  let color = type === CommunityTitleType.ACTIVE ? Color.APP_PURPLE : Color.APP_BLACK;

  if (size === CommunityTitleSize.SMALL) {
    textJsx = <BaseText textSize={ TextSize.H6 } bold={ bold } color={ color }>{ community.name }</BaseText>;
    imageSize = { height: 15, width: 15, marginRight: Whitespace.TINY };
  } else if (size === CommunityTitleSize.REGULAR) {
    textJsx = <BaseText bold={ bold } color={ color }>{ community.name }</BaseText>;
    imageSize = { height: 16, width: 16, marginRight: Whitespace.SMALL };
  } else if (size === CommunityTitleSize.LARGE) {
    textJsx = <BaseText textSize={ TextSize.H4 } bold={ bold } color={ color }>{ community.name }</BaseText>;
    imageSize = { height: 18, width: 18, marginRight: Whitespace.SMALL };
  } else if (size === CommunityTitleSize.XLARGE) {
    textJsx = <BaseText textSize={ TextSize.H2 } bold={ bold } color={ color }>{ community.name }</BaseText>;
    imageSize = { height: 25, width: 25, marginRight: 12 };
  }

  const imageSourceTransformed: ImageURISource = { uri: community.iconImage.regular };

  return (
    <View style={ [ styles.container, style ] }>
      <Image source={ imageSourceTransformed } style={ imageSize } />
      <View style={ styles.title }>
        { textJsx }
      </View>
    </View>
  );
};

CommunityTitle.defaultProps = {
  bold: false,
  size: CommunityTitleSize.REGULAR,
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  title: {
    flexDirection: 'row',
  },
  image : {
    height: Whitespace.LARGE,
    width: Whitespace.LARGE,
    flexDirection: 'row',
  },
});

export default CommunityTitle;
